"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import requestApi from "@/utils/api";
import { HStack, Icon, IconButton, Image, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaBell, FaSearch, FaUpload } from "react-icons/fa";

function Header() {
  const myInfo = useUserInfo((state: UserInfoState) => state.userInfo);
  const setMyInfo = useUserInfo((state: UserInfoState) => state.setUserInfo);
  const setFollower = useUserInfo((state: UserInfoState) => state.setFollowers);
  const setFollowing = useUserInfo(
    (state: UserInfoState) => state.setFollowings
  );
  const setVideos = useUserInfo((state: UserInfoState) => state.setMyVideos);
  const router = useRouter();
  return (
    <HStack
      w={"100%"}
      h={"89px"}
      backgroundColor={"#111"}
      p={"24px"}
      justifyContent={"space-between"}
      borderBottom={"1px solid #222"}
    >
      <HStack w={{ base: "60px", lg: "200px", xl: "240px" }}>
        <Image
          src="/images/logo.jpg"
          w={"50px"}
          borderRadius={"999px"}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        />
        <Text
          fontWeight={"700"}
          display={{ base: "none", lg: "block", xl: "block" }}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        >
          VIDEO SHARE APP
        </Text>
      </HStack>

      <HStack
        w={"500px"}
        h={"50px"}
        bgColor={"#222"}
        borderRadius={"999px"}
        overflow={"hidden"}
        border={"1px solid #333"}
        gap={"0"}
      >
        <Input border={"none"} outline={"none"} />
        <IconButton
          w={"50px"}
          h={"50px"}
          bgColor={"#222"}
          color={"#767676"}
          _hover={{ color: "#fff" }}
        >
          <FaSearch />
        </IconButton>
      </HStack>
      {myInfo ? (
        <HStack gap={"16px"}>
          <IconButton
            padding={"5px 10px"}
            bgColor={"#222"}
            color={"#c4c4c4"}
            _hover={{ opacity: "0.9" }}
            onClick={() => router.push("/upload")}
          >
            <FaUpload />
            <Text color={"#c4c4c4"}>Tải lên</Text>
          </IconButton>
          <Icon _hover={{ opacity: 0.9, cursor: "pointer" }}>
            <FaBell color="#c4c4c4" />
          </Icon>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="outline"
                size="md"
                borderRadius={"50%"}
                w={"30px"}
                h={"30px"}
              >
                <Avatar
                  size="md"
                  name="User"
                  _hover={{ opacity: 0.9, cursor: "pointer" }}
                  src={myInfo?.avatar_url}
                />
              </Button>
            </MenuTrigger>
            <MenuContent borderRadius={"16px"} p={"0"}>
              <MenuItem
                value="new-txt"
                cursor="pointer"
                onClick={() => {
                  const handleLogout = async () => {
                    try {
                      await requestApi("auth/logout", "POST", {
                        user_id: myInfo.id,
                      });
                      window.location.href = "/";
                      localStorage.removeItem("token");
                      setMyInfo(null);
                      setFollower([]);
                      setFollowing([]);
                      setVideos([]);
                    } catch (error) {
                      console.log(error);
                    }
                  };
                  handleLogout();
                }}
                borderRadius={"16px"}
                p={"10px 20px"}
              >
                Đăng xuất
              </MenuItem>
            </MenuContent>
          </MenuRoot>
        </HStack>
      ) : (
        <Button
          h={"40px"}
          bgColor={"#fe2c55"}
          _hover={{ opacity: 0.8 }}
          p={"0 16px"}
          onClick={() => router.push("/auth/login")}
        >
          <Text color={"#ffffffe6"}>Đăng nhập</Text>
        </Button>
      )}
    </HStack>
  );
}

export default Header;
