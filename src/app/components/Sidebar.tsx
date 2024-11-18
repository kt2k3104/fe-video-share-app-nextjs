"use client";

import { Avatar } from "@/components/ui/avatar";
import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaHome, FaUserCheck } from "react-icons/fa";
import UserBox from "./UserBox";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import { use } from "react";

function Sidebar() {
  const myInfo = useUserInfo((state: UserInfoState) => state.userInfo);
  const myFollowings = useUserInfo((state: UserInfoState) => state.followings);
  return (
    <VStack
      h="100%"
      w={{ base: "60px", lg: "200px", xl: "240px" }}
      flexShrink={0}
      bgColor={"#111"}
      p={"12px"}
      overflow="hidden"
      css={{
        "&:hover": {
          overflowY: "auto", // Hiện thanh cuộn khi hover
        },
        "&::-webkit-scrollbar": {
          width: "5px", // Kích thước scrollbar
        },
        scrollbarGutter: "stable",
        "&::-webkit-scrollbar-thumb": {
          background: "#222",
          borderRadius: "24px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
      }}
    >
      <Link href={"/"} style={{ width: "100%" }}>
        <HStack
          w={"100%"}
          h={"44px"}
          borderRadius={"10px"}
          _hover={{ bgColor: "#222" }}
          p={{ base: "0", lg: "0 12px" }}
        >
          <Icon m={"0 5px"} fontSize={"24px"}>
            <FaHome color={"#c4c4c4"} />
          </Icon>
          <Text
            fontWeight={"bold"}
            display={{ base: "none", lg: "block", xl: "block" }}
            color={"#c4c4c4"}
          >
            Dành cho bạn
          </Text>
        </HStack>
      </Link>
      <Link
        href={myInfo?.username ? "/following" : "/auth/login"}
        style={{ width: "100%" }}
      >
        <HStack
          w={"100%"}
          h={"44px"}
          borderRadius={"10px"}
          _hover={{ bgColor: "#222" }}
          p={{ base: "0", lg: "0 12px" }}
        >
          <Icon m={"0 5px"} fontSize={"24px"}>
            <FaUserCheck color={"#c4c4c4"} />
          </Icon>
          <Text
            fontWeight={"bold"}
            display={{ base: "none", lg: "block", xl: "block" }}
            color={"#c4c4c4"}
          >
            Đang Follow
          </Text>
        </HStack>
      </Link>
      <Link
        href={myInfo?.username ? `/${myInfo.username}` : "/auth/login"}
        style={{ width: "100%" }}
      >
        <HStack
          w={"100%"}
          h={"44px"}
          borderRadius={"10px"}
          _hover={{ bgColor: "#222" }}
          p={{ base: "0", lg: "0 12px" }}
        >
          <Avatar
            size={"sm"}
            name="User"
            src={myInfo?.avatar_url}
            m={"0 5px"}
            maxW={"24px"}
            maxH={"24px"}
          />
          <Text
            fontWeight={"bold"}
            display={{ base: "none", lg: "block", xl: "block" }}
            color={"#c4c4c4"}
          >
            Hồ sơ
          </Text>
        </HStack>
      </Link>
      <Box h={"1px"} w={"100%"} bgColor={"#333"} my={"12px"} flexShrink={"0"} />

      <Text
        fontWeight={"bold"}
        color={"#c4c4c4"}
        display={{ base: "none", lg: "block" }}
      >
        Các tài khoản đã follow
      </Text>
      {myFollowings && myFollowings.length > 0 ? (
        myFollowings.map((user) => <UserBox user={user} key={user.id} />)
      ) : (
        <Text fontSize={"12px"} color={"GrayText"}>
          Bạn chưa follow ai
        </Text>
      )}
    </VStack>
  );
}

export default Sidebar;
