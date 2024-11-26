"use client";
import { Button } from "@/components/ui/button";
import requestApi from "@/utils/api";
import { Text, VStack } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Verify() {
  useEffect(() => {
    document.title = "Verify";
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const userid = searchParams.get("user_id");
  const token = searchParams.get("token");

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (userid && token) {
      // Call api to verify user
      const callAPI = async () => {
        try {
          const res = await requestApi("auth/verify", "POST", {
            user_id: +userid,
            token,
          });
          if (res.data.message === "Verify account successfully") {
            setIsVerified(true);
          }
        } catch (error) {
          console.log(error);
          alert("Xác thực tài khoản thất bại");
        }
      };

      callAPI();
    }
  }, [userid, token]);

  return (
    <VStack w={"100vw"} h={"100vh"} m={"0"} p={"0"} justifyContent={"center"}>
      {isVerified && (
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
      )}
    </VStack>
  );
}
export default Verify;
