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
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

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

  let user: any = userParams;
  if (myInfo && +myInfo.id === userParams.id) {
    user = {
      ...myInfo,
      videos: myVideos,
      followers: myFollowers,
      followings: myFollowings,
    };
  }

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
      console.log(error);
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
      console.log(error);
      if (error.response.data.error === "Unauthorized") {
        const result = confirm("Bạn cần đăng nhập để thực hiện chức năng này");
        if (result) {
          router.push("/auth/login");
        }
      }
    }
  };

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
          <DialogRoot placement="center" motionPreset="slide-in-bottom">
            <DialogTrigger asChild>
              <Text cursor={"pointer"} _hover={{ textDecoration: "underline" }}>
                {user.followings.length} Đang Follow
              </Text>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Đang Follow</DialogTitle>
              </DialogHeader>
              <DialogBody
                maxH={"500px"}
                overflow={"auto"}
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
                {user.followings.length === 0 && <Text>Không follow ai</Text>}
                {user.followings.length > 0 &&
                  user.followings.map((item: any) => (
                    <Link key={item.id} href={`/${item.username}`}>
                      <HStack
                        gap={"12px"}
                        mt={"10px"}
                        cursor="pointer"
                        p={"8px"}
                      >
                        <Avatar
                          src={item.avatar_url}
                          maxW={"50px"}
                          maxH={"50px"}
                          w={"50px"}
                          h={"50px"}
                        />
                        <Box>
                          <Text
                            fontSize={"18px"}
                            fontWeight={"700"}
                            lineHeight={"24px"}
                          >
                            {item.full_name}
                          </Text>
                          <Text
                            color={"rgba(255, 255, 255, 0.5)"}
                            fontSize={"14px"}
                            lineHeight={"18px"}
                          >
                            {item.username.split("@")[1]}
                          </Text>
                        </Box>
                      </HStack>
                    </Link>
                  ))}
              </DialogBody>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>
          <DialogRoot placement="center" motionPreset="slide-in-bottom">
            <DialogTrigger asChild>
              <Text cursor={"pointer"} _hover={{ textDecoration: "underline" }}>
                {user.followers.length === 0
                  ? "0 Follower"
                  : `${user.followers.length} Followers`}
              </Text>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Followers</DialogTitle>
              </DialogHeader>
              <DialogBody
                maxH={"500px"}
                overflow={"auto"}
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
                {user.followers.length === 0 && <Text>Không có ai follow</Text>}
                {user.followers.length > 0 &&
                  user.followers.map((item: any) => (
                    <Link key={item.id} href={`/${item.username}`}>
                      <HStack
                        gap={"12px"}
                        mt={"10px"}
                        cursor="pointer"
                        p={"8px"}
                      >
                        <Avatar
                          src={item.avatar_url}
                          maxW={"50px"}
                          maxH={"50px"}
                          w={"50px"}
                          h={"50px"}
                        />
                        <Box>
                          <Text
                            fontSize={"18px"}
                            fontWeight={"700"}
                            lineHeight={"24px"}
                          >
                            {item.full_name}
                          </Text>
                          <Text
                            color={"rgba(255, 255, 255, 0.5)"}
                            fontSize={"14px"}
                            lineHeight={"18px"}
                          >
                            {item.username.split("@")[1]}
                          </Text>
                        </Box>
                      </HStack>
                    </Link>
                  ))}
              </DialogBody>
              <DialogCloseTrigger />
            </DialogContent>
          </DialogRoot>

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
