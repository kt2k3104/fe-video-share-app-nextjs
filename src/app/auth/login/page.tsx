"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toaster, toaster } from "@/components/ui/toaster";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import requestApi from "@/utils/api";
import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const setUserInfo = useUserInfo((state: UserInfoState) => state.setUserInfo);
  const setFollower = useUserInfo((state: UserInfoState) => state.setFollowers);
  const setStrangeUsers = useUserInfo(
    (state: UserInfoState) => state.setStrangeUsers
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const router = useRouter();

  const handleLogin: SubmitHandler<Inputs> = async (data) => {
    try {
      const { data: responseData } = await requestApi("auth/login", "POST", {
        email: data.email,
        password: data.password,
      });
      if (responseData.success) {
        localStorage.setItem("accessToken", responseData.data.access_token);
        localStorage.setItem("refreshToken", responseData.data.refresh_token);

        const { data: usersData } = await requestApi("users/me", "GET", null);
        setUserInfo({
          _id: usersData.id,
          fullname: usersData.fullname,
          username: usersData.username,
          email: usersData.email,
          avatar_url: usersData.avatar,
          bio: usersData.bio,
        });
        setFollower(usersData.follower);
        setStrangeUsers(usersData.strangers);
        setOpen(true);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.message === "Email is not registed.") {
        toaster.create({
          type: "error",
          title: `Email không tồn tại`,
          duration: 3000,
        });
      }
      if (error.response.data.message === "Password is not correct") {
        toaster.create({
          type: "error",
          title: `Mật khẩu không đúng`,
          duration: 3000,
        });
      }
      if (error.response.data.message === "Account is not verified") {
        toaster.create({
          type: "error",
          title: `Tài khoản chưa được xác minh`,
          duration: 3000,
        });
      }
    }
  };

  return (
    <VStack w={"100vw"} h={"100vh"} p={"0"} m={"0"} justifyContent={"center"}>
      <Toaster />
      <Box w={"500px"} h={"500px"}>
        <Text fontSize={"24px"} textAlign={"center"} mb={"50px"}>
          Đăng nhập
        </Text>
        <form onSubmit={handleSubmit(handleLogin)}>
          <Input
            fontSize={"1.4rem"}
            h={"42px"}
            p={"0 16px"}
            mb={"12px"}
            type="email"
            id="email"
            value={email}
            placeholder="Email"
            {...register("email", {
              required: true,
              pattern: /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/i,
            })}
            onChange={(e: any) => {
              setEmail(e.target.value);
            }}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                handleSubmit(handleLogin);
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
                handleSubmit(handleLogin);
              }
            }}
          />
          <Button
            fontSize={"1.4rem"}
            type="submit"
            colorScheme="blue"
            display={"flex"}
            m={"0 auto"}
          >
            Tiếp tục
          </Button>
          <Box display={"flex"} justifyContent={"center"} mt={"30px"}>
            <Checkbox>Duy trì đăng nhập</Checkbox>
          </Box>
          <HStack>
            <Text
              mt={"10px"}
              ml={"auto"}
              cursor={"pointer"}
              _hover={{ opacity: 0.8 }}
              onClick={() => {
                router.replace("/auth/register");
              }}
            >
              Chưa có tài khoản?
            </Text>
          </HStack>
        </form>
      </Box>
      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => {
          setOpen(e.open);
          if (!e.open) router.replace("/");
        }}
        placement={"center"}
        motionPreset="slide-in-bottom"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogBody>
            <DialogTitle>Đăng nhập thành công</DialogTitle>
          </DialogBody>
          <DialogFooter>
            <Button
              onClick={() => {
                router.replace("/");
              }}
            >
              Đi đến trang chủ
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
}

export default Login;
