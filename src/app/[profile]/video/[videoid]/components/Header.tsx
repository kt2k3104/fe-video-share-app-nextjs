"use client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaComment, FaHeart } from "react-icons/fa";
import { FaE, FaEllipsis } from "react-icons/fa6";

export const formatDate = (createAt: string) => {
  const now: any = new Date();
  const createdDate: any = new Date(createAt);
  const diffInMs = now - createdDate; // Thời gian chênh lệch (ms)
  const diffInMinutes = Math.floor(diffInMs / 1000 / 60); // Đổi sang phút
  const diffInHours = Math.floor(diffInMinutes / 60); // Đổi sang giờ
  const diffInDays = Math.floor(diffInHours / 24); // Đổi sang ngày

  // Nếu trong vòng 1 giờ
  if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  }

  // Nếu trong vòng 24 giờ
  if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  }

  // Nếu trong vòng 7 ngày
  if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  }

  // Nếu quá 7 ngày
  const isSameYear = now.getFullYear() === createdDate.getFullYear();
  const day = String(createdDate.getDate()).padStart(2, "0");
  const month = String(createdDate.getMonth() + 1).padStart(2, "0");
  const year = createdDate.getFullYear();

  if (isSameYear) {
    return `${day}-${month}`;
  } else {
    return `${day}-${month}-${year}`;
  }
};

export default function Header({ video }: { video: any }) {
  const myInfo = useUserInfo((state: UserInfoState) => state.userInfo);
  const myFollowings = useUserInfo((state: UserInfoState) => state.followings);
  const addFollowings = useUserInfo(
    (state: UserInfoState) => state.addFollowings
  );
  const removeFollowings = useUserInfo(
    (state: UserInfoState) => state.removeFollowings
  );
  const [title, setTitle] = useState(video?.title);
  const [description, setDescription] = useState(video?.description);
  const [isLiked, setIsLiked] = useState(false);

  const router = useRouter();

  const handleFollow = async () => {
    try {
      const response: any = await axios.post(
        `http://localhost:9000/api/v1/users/${video.user.id}/follow`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Thêm Bearer Token
          },
        }
      );
      if (response.data.message === "Follow user successfully") {
        addFollowings({
          id: video.user.id.toString(),
          full_name: video.user.full_name,
          username: video.user.username,
          avatar_url: video.user.avatar_url,
          bio: video.user.bio,
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
      const response: any = await axios.post(
        `http://localhost:9000/api/v1/users/${video.user.id}/unfollow`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Thêm Bearer Token
          },
        }
      );
      if (response.data.message === "Unfollow user successfully") {
        removeFollowings(video.user.id.toString());
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
  return (
    <Box w={"100%"} p={"16px 16px 0"}>
      <Box bgColor={"#ffffff0a"} p={"20px"} borderRadius={"10px"}>
        <HStack justifyContent={"space-between"}>
          <HStack
            cursor="pointer"
            onClick={() => {
              router.push(`/${video.user.username}`);
            }}
          >
            <Avatar src={video?.user.avatar_url} />
            <Box>
              <Text
                color={"#ffffffe6"}
                _hover={{ textDecoration: "underline" }}
              >
                {video?.user.username}
              </Text>
              <Text color={"#ffffffe6"} fontSize={"12px"}>
                {video?.user.full_name} · {formatDate(video?.created_at)}
              </Text>
            </Box>
          </HStack>
          {myInfo && +myInfo.id === +video?.user?.id ? (
            <MenuRoot>
              <MenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  w={"36px"}
                  h={"36px"}
                  borderRadius={"50%"}
                >
                  <FaEllipsis />
                </Button>
              </MenuTrigger>
              <MenuContent>
                <DialogRoot placement="center" motionPreset="slide-in-bottom">
                  <DialogTrigger asChild>
                    <MenuItem value="edit">Chỉnh sửa</MenuItem>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa video</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <VStack alignItems={"flex-start"}>
                        <HStack>
                          <label htmlFor="title" style={{ minWidth: "100px" }}>
                            Title
                          </label>
                          <Input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={video.title}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                        </HStack>
                        <HStack>
                          <label
                            htmlFor="description"
                            style={{ minWidth: "100px" }}
                          >
                            Description
                          </label>
                          <Textarea
                            id="description"
                            name="description"
                            defaultValue={video.description}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </HStack>
                      </VStack>
                    </DialogBody>
                    <DialogFooter>
                      <DialogActionTrigger asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogActionTrigger>
                      <DialogActionTrigger asChild>
                        <Button
                          onClick={() => {
                            const handleUpdateVideoData = async () => {
                              try {
                                const response: any = await axios.put(
                                  `http://localhost:9000/api/v1/videos/${video.id}`,
                                  {
                                    title,
                                    description,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${localStorage.getItem(
                                        "accessToken"
                                      )}`, // Thêm Bearer Token
                                    },
                                  }
                                );
                                if (
                                  response.data.message ===
                                  "Update video data successfully"
                                ) {
                                  window.location.href = `/${video.user.username}/video/${video.id}`;
                                }
                              } catch (error: any) {
                                if (
                                  error.response.data.error === "Unauthorized"
                                ) {
                                  const result = confirm(
                                    "Bạn cần đăng nhập để thực hiện chức năng này"
                                  );
                                  if (result) {
                                    router.push("/auth/login");
                                  }
                                }
                              }
                            };
                            handleUpdateVideoData();
                          }}
                        >
                          Save
                        </Button>
                      </DialogActionTrigger>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
                <MenuItem
                  value="delete"
                  onClick={() => {
                    const handleDeleteVideo = async () => {
                      try {
                        const response: any = await axios.delete(
                          `http://localhost:9000/api/v1/videos/${video.id}`,
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                "accessToken"
                              )}`, // Thêm Bearer Token
                            },
                            data: { url: video.url },
                          }
                        );
                        console.log(response);
                        if (
                          response.data.message === "Delete video successfully"
                        ) {
                          alert("Xóa video thành công");
                          window.location.href = `/${video.user.username}`;
                        }
                      } catch (error: any) {
                        if (error.response.data.error === "Unauthorized") {
                          const result = confirm(
                            "Bạn cần đăng nhập để thực hiện chức năng này"
                          );
                          if (result) {
                            router.push("/auth/login");
                          }
                        }
                      }
                    };
                    handleDeleteVideo();
                  }}
                >
                  Xóa
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          ) : myFollowings &&
            myFollowings.filter((item) => +item.id === video?.user?.id).length >
              0 ? (
            <Button
              h={"40px"}
              bgColor={"#313131"}
              _hover={{ opacity: 0.8 }}
              mt={"10px"}
              p={"0 16px"}
              onClick={handleUnFollow}
            >
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
        </HStack>
        <Text mt={"10px"}>{video?.title}</Text>
        <Text fontSize={"12px"}>{video?.description}</Text>
      </Box>
      <HStack m={"10px"} gap={"20px"}>
        <HStack>
          <IconButton
            w={"40px"}
            h={"40px"}
            borderRadius={"50%"}
            bgColor={"#ffffff1f"}
            _hover={{ opacity: 0.8 }}
            onClick={() => setIsLiked(!isLiked)}
          >
            <FaHeart color={isLiked ? "#eb4e60" : "#ebebeb"} />
          </IconButton>
          <Text>{video?.likes_count}</Text>
        </HStack>
        <HStack>
          <IconButton
            w={"40px"}
            h={"40px"}
            borderRadius={"50%"}
            bgColor={"#ffffff1f"}
          >
            <FaComment color="#ebebeb" />
          </IconButton>
          <Text>{video?.comments_count}</Text>
        </HStack>
      </HStack>
    </Box>
  );
}
