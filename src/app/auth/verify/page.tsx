"use client";
import { Button } from "@/components/ui/button";
import requestApi from "@/utils/api";
import { Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const user_id = searchParams.get("user_id");
  const token = searchParams.get("token");

  useEffect(() => {
    if (user_id && token) {
      // Call api to verify user
      const callAPI = async () => {
        try {
          await requestApi("auth/verify", "POST", {
            user_id,
            token,
          });
        } catch (error) {
          console.log(error);
        }
      };

      callAPI();
    }
  }, [user_id, token]);

  return (
    <VStack w={"100vw"} h={"100vh"} m={"0"} p={"0"} justifyContent={"center"}>
      <VStack w={"500px"}>
        <Text>Xác thực tài khoản thành công!</Text>
        <Button
          onClick={() => {
            router.replace("/auth/login");
          }}
        >
          Quay lại đăng nhập
        </Button>
      </VStack>
    </VStack>
  );
}
export default Verify;
