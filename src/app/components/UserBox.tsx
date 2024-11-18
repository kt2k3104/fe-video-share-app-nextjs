"use client";

import { Avatar } from "@/components/ui/avatar";
import { HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function UserBox({ user }: { user: any }) {
  return (
    <Link href={`/${user.username}`} style={{ width: "100%" }}>
      <HStack
        w={"100%"}
        h={"54px"}
        borderRadius={"10px"}
        _hover={{ bgColor: "#222" }}
        p={{ base: "0", lg: "0 12px" }}
      >
        <Avatar
          name="User"
          src={user.avatar_url}
          m={"0 5px"}
          maxW={"36px"}
          maxH={"36px"}
        />
        <VStack gap={"0"} alignItems={"flex-start"}>
          <Text
            fontWeight={"bold"}
            display={{ base: "none", lg: "block", xl: "block" }}
            color={"#c4c4c4"}
            maxW={{ lg: "110px", xl: "130px" }}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {user?.username.split("@")[1]}
          </Text>
          <Text
            fontWeight={"normal"}
            display={{ base: "none", lg: "block", xl: "block" }}
            color={"#c4c4c4"}
            maxW={{ lg: "110px", xl: "130px" }}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {user?.full_name}
          </Text>
        </VStack>
      </HStack>
    </Link>
  );
}
