import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Box, HStack, Text } from "@chakra-ui/react";
import { UserProfile } from "../page";
import { FaUserCheck } from "react-icons/fa";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import { useRouter } from "next/navigation";
import DialogProfile from "./DialogProfile";
import { useEffect, useRef } from "react";
import requestApi from "@/utils/api";

export default function Header({ userParams }: { userParams: UserProfile }) {
  const myInfo = useUserInfo((state: UserInfoState) => state.userInfo);
  const myFollowings = useUserInfo((state: UserInfoState) => state.followings);
  const myFollowers = useUserInfo((state: UserInfoState) => state.followers);
  const addFollowings = useUserInfo(
    (state: UserInfoState) => state.addFollowings
  );
  const removeFollowings = useUserInfo(
    (state: UserInfoState) => state.removeFollowings
  );
  const myVideos = useUserInfo((state: UserInfoState) => state.myVideos);
  const setMyVideos = useUserInfo((state: UserInfoState) => state.setMyVideos);

  const router = useRouter();

  const handleFollow = async () => {
    try {
      const response = await requestApi(`users/follow`, "POST", {
        id: user.id,
      });

      if (response.data.message === "Follow user successfully") {
        addFollowings({
          id: user.id.toString(),
          full_name: user.full_name,
          username: user.username,
          avatar_url: user.avatar_url,
          bio: user.bio,
        });
      }
    } catch (error: any) {
      if (error.response.data.error === "Unauthorized") {
        const result = confirm("Bạn cần đăng nhập để thực hiện chức năng này");
        if (result) {
          router.push("/auth/login");
        }
      }
    }
  };

  const handleUnFollow = async () => {
    try {
      const response = await requestApi(`users/unfollow`, "POST", {
        id: user.id,
      });
      if (response.data.message === "Unfollow user successfully") {
        removeFollowings(user.id.toString());
      }
    } catch (error: any) {
      if (error.response.data.error === "Unauthorized") {
        const result = confirm("Bạn cần đăng nhập để thực hiện chức năng này");
        if (result) {
          router.push("/auth/login");
        }
      }
    }
  };

  let user: any = userParams;
  if (myInfo && +myInfo.id === userParams.id) {
    user = {
      ...myInfo,
      videos: myVideos,
      followers: myFollowers,
      followings: myFollowings,
    };
  }

  const isProcessing = useRef(false);

  useEffect(() => {
    const fetchMyVideos = async () => {
      if (isProcessing.current) return;
      isProcessing.current = true;
      try {
        const response = await requestApi(
          "videos/me?page=1&limit=20",
          "GET",
          null
        );
        setMyVideos(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        isProcessing.current = false;
      }
    };
    if (myInfo && +myInfo.id === userParams.id) {
      fetchMyVideos();
    }
  }, []);

  return (
    <HStack gap={"36px"}>
      <Avatar
        src={user.avatar_url}
        maxW={"150px"}
        maxH={"150px"}
        w={"150px"}
        h={"150px"}
      />
      <Box textAlign={"start"}>
        <HStack gap={"12px"}>
          <Text
            fontSize={"24px"}
            lineHeight={"30px"}
            fontWeight={"700"}
            color={"#ffffffe6"}
          >
            {user.username.split("@")[1]}
          </Text>
          <Text
            fontSize={"18px"}
            lineHeight={"24px"}
            fontWeight={"600"}
            color={"#ffffffe6"}
          >
            {user.full_name}
          </Text>
        </HStack>
        {myInfo && +myInfo.id === +user.id ? (
          <DialogProfile />
        ) : myFollowings &&
          myFollowings.filter((item) => +item.id === user.id).length > 0 ? (
          <Button
            h={"40px"}
            bgColor={"#313131"}
            _hover={{ opacity: 0.8 }}
            mt={"10px"}
            p={"0 16px"}
            onClick={handleUnFollow}
          >
            <FaUserCheck color="#ffffffe6" />
            <Text color={"#ffffffe6"}>Đang Follow</Text>
          </Button>
        ) : (
          <Button
            h={"40px"}
            bgColor={"#fe2c55"}
            _hover={{ opacity: 0.8 }}
            mt={"10px"}
            p={"0 16px"}
            onClick={handleFollow}
          >
            <Text color={"#ffffffe6"}>Follow</Text>
          </Button>
        )}
        <HStack mt={"10px"} gap={"15px"}>
          <Text cursor={"pointer"} _hover={{ textDecoration: "underline" }}>
            {user.followings.length} Đang Follow
          </Text>
          <Text cursor={"pointer"} _hover={{ textDecoration: "underline" }}>
            {user.followers.length} Follower
          </Text>
          <Text userSelect={"none"}>
            {user.videos.reduce(
              (total: any, video: any) => total + video.likes_count,
              0
            )}{" "}
            Thích
          </Text>
        </HStack>
        <Text mt={"10px"} color={"#ffffffe6"}>
          {user.username}
        </Text>
        <Text>{user.bio}</Text>
      </Box>
    </HStack>
  );
}
