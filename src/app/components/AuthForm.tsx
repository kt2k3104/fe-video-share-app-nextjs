"use client";
import { Box, Button, Input, Link, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Variant } from "@/app/types";
import requestApi from "@/utils/api";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import { toaster } from "@/components/ui/toaster";
import useLogic, { LogicState } from "@/hooks/useLogic";
import { Checkbox } from "@/components/ui/checkbox";

type Inputs = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm_password: string;
};

interface AuthFormProps {
  variant: Variant;
  setVariant: Dispatch<SetStateAction<Variant>>;
}

const AuthForm = ({ variant, setVariant }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [spinner, setSpinner] = useState(false);

  const setUserInfo = useUserInfo((state: UserInfoState) => state.setUserInfo);
  const setFollower = useUserInfo((state: UserInfoState) => state.setFollowers);
  const setStrangeUsers = useUserInfo(
    (state: UserInfoState) => state.setStrangeUsers
  );

  const isInitLogin = useLogic((state: LogicState) => state.isInitLogin);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const handleResgister: SubmitHandler<Inputs> = async (data) => {
    setSpinner(true);
    if (data.password !== data.confirm_password) {
      toaster.create({
        title: "Mật khẩu không khớp",
        type: "error",
        duration: 3000,
        placement: "top",
      });
      return;
    }
    try {
      const response = await axios.post(
        // `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
        `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }
      );
      if (response.data.success) {
        setVariant(Variant.LOGIN);
        setPassword("");
        setConfirmPassword("");
        toaster.create({
          placement: "top",
          title: `Đăng ký thành công`,
          duration: 3000,
          type: "success",
        });
        setPassword("");
        setConfirmPassword("");
        reset();
        setSpinner(false);
      }
    } catch (error) {
      console.log(error);
      toaster.create({
        type: "error",
        placement: "top",
        title: `Email đã tồn tại`,
        duration: 3000,
      });
    }
  };

  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    try {
      setSpinner(true);
      const { data: responseData } = await requestApi("auth/login", "POST", {
        email: data.email,
        password: data.password,
      });
      if (responseData.success) {
        localStorage.setItem(
          "accessToken",
          responseData.metadata.token.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          responseData.metadata.token.refreshToken
        );
        localStorage.setItem("userId", responseData.metadata.userId);

        const { data: usersData } = await requestApi("users/me", "GET", null);
        setUserInfo({
          _id: usersData.metadata.id,
          fullname: usersData.metadata.fullname,
          username: usersData.metadata.username,
          email: usersData.metadata.email,
          avatar_url: usersData.metadata.avatar,
          bio: usersData.metadata.bio,
        });
        setFollower(usersData.metadata.follower);
        setStrangeUsers(usersData.metadata.strangers);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "Email is not registred.") {
        toaster.create({
          type: "error",
          placement: "top",
          title: `Email không tồn tại`,
          duration: 3000,
        });
        setSpinner(false);
      }
      if (error.response.data.message === "Password is not correct") {
        toaster.create({
          type: "error",
          placement: "top",
          title: `Mật khẩu không đúng`,
          duration: 3000,
        });
        setSpinner(false);
      }
    }
  };

  return (
    <Box m={"0 auto"} w={"318px"}>
      {variant === Variant.REGISTER && (
        <Text fontSize={"24px"} textAlign={"center"}>
          Đăng ký
        </Text>
      )}
      {spinner || isInitLogin ? (
        <Box w="100%" textAlign="center">
          <Spinner color="gray" size="xl" />
        </Box>
      ) : (
        <form
          onSubmit={handleSubmit(
            variant === "LOGIN" ? handleLogin : handleResgister
          )}
        >
          {variant === Variant.REGISTER && (
            <>
              <Input
                fontSize={"1.4rem"}
                h={"42px"}
                p={"0 16px"}
                mb={"12px"}
                placeholder="Họ"
                {...register("lastName", {
                  required: true,
                  pattern: /^[A-Za-z]+$/i,
                })}
              />
              <Input
                fontSize={"1.4rem"}
                h={"42px"}
                p={"0 16px"}
                mb={"12px"}
                placeholder="Tên"
                {...register("firstName", { required: true, maxLength: 20 })}
              />
            </>
          )}
          <Input
            fontSize={"1.4rem"}
            h={"42px"}
            p={"0 16px"}
            mb={"12px"}
            type="email"
            id="email"
            value={email}
            placeholder={
              variant === Variant.LOGIN ? "Email hoặc số điện thoại" : "Email"
            }
            {...register("email", {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i,
            })}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(
                  variant === Variant.LOGIN ? handleLogin : handleResgister
                );
              }
            }}
          />
          <Input
            fontSize={"1.4rem"}
            h={"42px"}
            p={"0 16px"}
            mb={"12px"}
            type="password"
            id="password"
            placeholder="Mật khẩu"
            value={password}
            {...register("password", { required: true, minLength: 6 })}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(
                  variant === Variant.LOGIN ? handleLogin : handleResgister
                );
              }
            }}
          />
          {variant === Variant.REGISTER && (
            <Input
              fontSize={"1.4rem"}
              h={"42px"}
              p={"0 16px"}
              mb={"12px"}
              type="password"
              id="confirm_password"
              placeholder="Mật khẩu nhập lại"
              value={confirmPassword}
              {...register("confirm_password", {
                required: true,
                minLength: 6,
              })}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          )}
          <Button
            fontSize={"1.4rem"}
            type="submit"
            colorScheme="blue"
            display={"flex"}
            m={"0 auto"}
          >
            Tiếp tục
          </Button>
          {variant === Variant.LOGIN && (
            <Box display={"flex"} justifyContent={"center"} mt={"30px"}>
              <Checkbox>Duy trì đăng nhập</Checkbox>
            </Box>
          )}
          {variant === Variant.REGISTER && (
            <Link
              display={"flex"}
              justifyContent={"flex-end"}
              mt={"10px"}
              onClick={() => {
                setConfirmPassword("");
                setEmail("");
                setPassword("");
                setVariant(Variant.LOGIN);
              }}
            >
              Quay lại đăng nhập
            </Link>
          )}
        </form>
      )}
    </Box>
  );
};

export default AuthForm;
