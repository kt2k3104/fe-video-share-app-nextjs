"use client";

import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster, toaster } from "@/components/ui/toaster";
import {
  Box,
  Button,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Metadata } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
};

function Register() {
  useEffect(() => {
    document.title = "Register";
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<Inputs>();

  const router = useRouter();

  const handleResgister: SubmitHandler<Inputs> = async (data) => {
    if (data.password !== data.confirm_password) {
      toaster.create({
        title: "Mật khẩu không khớp",
        type: "error",
        duration: 3000,
      });
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
        {
          username: data.username,
          email: data.email,
          password: data.password,
        }
      );
      if (response.data.success) {
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        reset();
        setOpen(true);
      }
    } catch (error: any) {
      if (error.response.data.message === "Email already exists") {
        toaster.create({
          type: "error",
          title: `Email đã tồn tại`,
          duration: 3000,
        });
      } else if (error.response.data.message === "Username already exists") {
        toaster.create({
          type: "error",
          title: `Username đã tồn tại`,
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
          Đăng ký
        </Text>
        <form onSubmit={handleSubmit(handleResgister)}>
          <Input
            fontSize={"1.4rem"}
            h={"42px"}
            p={"0 16px"}
            mb={"12px"}
            placeholder="Username"
            {...register("username", {
              required: true,
              pattern: /^[A-Za-z]+$/i,
            })}
          />
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
            onChange={(e) => {
              setEmail(e.target.value);
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
          />
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
          <Button
            fontSize={"1.4rem"}
            type="submit"
            colorScheme="blue"
            display={"flex"}
            m={"0 auto"}
          >
            Tiếp tục
          </Button>
          <HStack>
            <Text
              mt={"10px"}
              ml={"auto"}
              cursor={"pointer"}
              _hover={{ opacity: 0.8 }}
              onClick={() => {
                router.replace("/auth/login");
              }}
            >
              Quay lại đăng nhập
            </Text>
          </HStack>
        </form>
      </Box>
      <DialogRoot
        lazyMount
        open={open}
        onOpenChange={(e) => {
          setOpen(e.open);
          if (!e.open) router.replace("/auth/login");
        }}
        placement={"center"}
        motionPreset="slide-in-bottom"
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogCloseTrigger />
          <DialogBody>
            <DialogTitle>
              Đăng ký thành công. Truy cập email của bạn để xác thực tài khoản
            </DialogTitle>
          </DialogBody>
          <DialogFooter />
        </DialogContent>
      </DialogRoot>
    </VStack>
  );
}

export default Register;
