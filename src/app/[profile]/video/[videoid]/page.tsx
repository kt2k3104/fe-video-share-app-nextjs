"use client";

import {
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Header, { formatDate } from "./components/Header";
import { Avatar } from "@/components/ui/avatar";
import { FaRegHeart } from "react-icons/fa";
import requestApi from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import { IoClose } from "react-icons/io5";

export interface IParams {
  videoid: string;
}

export default function VideoPage({ params }: { params: IParams }) {
  const [video, setVideo] = useState<any>(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState<any>([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const videoIndex = searchParams.get("videoIndex");

  useEffect(() => {
    const handleGetVideo = async () => {
      try {
        const response = await requestApi(
          `videos/${params.videoid}`,
          "GET",
          null
        );
        setVideo(response.data.data);
        setComments(response.data.data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetVideo();
  }, []);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const [volume, setVolume] = useState(1); // Volume mặc định

  useEffect(() => {
    const savedVolume = localStorage.getItem("videoVolume");
    if (savedVolume) {
      setVolume(parseFloat(savedVolume)); // Lấy volume từ localStorage
    }
  }, []);

  // Đồng bộ trạng thái pause và play
  const handlePause = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.pause();
    }
  };

  const handlePlay = () => {
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.play();
    }
  };

  // Cập nhật volume khi thay đổi
  const handleVolumeChange = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const newVolume = e.target.volume;
    setVolume(newVolume);
    localStorage.setItem("videoVolume", newVolume.toString()); // Lưu vào localStorage
  };

  {
    /*
    Sử dụng `useEffect` để thay đổi volume sau khi video được render
  */
  }
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume; // Áp dụng volume từ state
    }
  }, [volume]); // Khi volume thay đổi thì cập nhật volume cho video chính

  useEffect(() => {
    document.title = "Video";
  }, []);

  const handleComment = async () => {
    try {
      console.log("hahaa");
      const response = await requestApi(`comments/${video.id}`, "POST", {
        content: commentInput,
      });
      setComments([response.data.data.comment, ...comments]);
      setVideo({
        ...video,
        comments_count: video.comments_count + 1,
      });
    } catch (error: any) {
      console.log(error);
      if (error.response.data.error === "Unauthorized") {
        const result = confirm("Bạn cần đăng nhập để bình luận");
        if (result) {
          router.push("/auth/login");
        }
      }
    }
  };

  return (
    <HStack
      flex={"1"}
      h={"calc(100vh - 110px)"}
      textAlign={"center"}
      bgColor={"#111"}
      gap={"0"}
    >
      <Box
        position="relative"
        w="100%" // Chiều rộng thẻ Box
        h="100%" // Chiều cao thẻ Box
        overflow="hidden" // Ẩn phần thừa
        bg="black" // Nền đen cho Box
        borderRadius={"16px"}
      >
        {/*
    Video chính, đảm bảo hiển thị đầy đủ
  */}
        <video
          ref={videoRef}
          src={video?.url}
          autoPlay
          controls
          loop
          onPause={handlePause} // Đồng bộ khi pause
          onPlay={handlePlay} // Đồng bộ khi play
          onVolumeChange={handleVolumeChange} // Cập nhật volume
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            objectFit: "contain", // Hiển thị toàn bộ video
            zIndex: 1, // Đảm bảo video ở trên
          }}
        />

        {/*
    Video nền làm mờ
  */}
        <video
          ref={backgroundVideoRef}
          src={video?.url}
          autoPlay
          loop
          muted
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "100%",
            objectFit: "cover", // Làm đầy Box
            filter: "blur(20px) brightness(0.5)", // Làm mờ và giảm độ sáng
            zIndex: 0, // Nền bên dưới
          }}
        />
        <IconButton
          position="absolute"
          top="10px"
          left="10px"
          maxW={"40px"}
          maxH={"40px"}
          w="40px"
          h="40px"
          borderRadius="50%"
          zIndex="99"
          p={"0"}
          variant="surface"
          onClick={() => {
            router.push(videoIndex ? `/?videoIndex=${videoIndex}` : "/");
          }}
        >
          <IoClose />
        </IconButton>
      </Box>
      <Box w={"500px"} h={"100%"}>
        <Box
          w={"100%"}
          h={"calc(100% - 90px)"}
          textAlign={"start"}
          overflow="auto"
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
          position={"relative"}
        >
          <Header video={video} />
          <Tabs.Root defaultValue="comments" w={"100%"} p={"0 16px"}>
            <Tabs.List justifyContent={"space-between"} gap={"0"}>
              <Tabs.Trigger value="comments">
                Bình luận ({video?.comments_count})
              </Tabs.Trigger>
              <Tabs.Trigger value="videos">Video của nhà sáng tạo</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="comments">
              {comments.length > 0 &&
                comments.map((comment: any, index: number) => (
                  <HStack
                    key={index}
                    mb={"5px"}
                    justifyContent={"space-between"}
                  >
                    <HStack>
                      <Avatar src={comment?.user?.avatar_url} />
                      <Box>
                        <Text color={"#ffffffe6"} fontSize={"14px"}>
                          {comment?.user?.full_name}
                        </Text>
                        <Text color={"#ffffffe6"} fontSize={"16px"}>
                          {comment?.content}
                        </Text>
                        <HStack>
                          <Text color={"#c4c4c4"} fontSize={"12px"}>
                            {formatDate(comment?.created_at)}
                          </Text>
                          <Text
                            color={"#c4c4c4"}
                            fontSize={"12px"}
                            cursor="pointer"
                            _hover={{ textDecoration: "underline" }}
                          >
                            Trả lời
                          </Text>
                        </HStack>
                      </Box>
                    </HStack>
                    <VStack alignItems={"center"} gap={"0"}>
                      <FaRegHeart cursor="pointer" />
                      <Text color={"#c4c4c4"}>{comment?.likes_count}</Text>
                    </VStack>
                  </HStack>
                ))}
              {comments.length === 0 && (
                <HStack>
                  <Text color={"#c4c4c4"}>Chưa có bình luận</Text>
                </HStack>
              )}
            </Tabs.Content>
            <Tabs.Content value="videos">
              Tính năng đang được phát triển
            </Tabs.Content>
          </Tabs.Root>
        </Box>
        <HStack
          w={"100%"}
          h={"90px"}
          p={"0 16px"}
          borderTop={"1px solid #333"}
          bgColor={"#111"}
        >
          <Input
            type="text"
            placeholder="Viết bình luận..."
            w={"calc(100% - 100px)"}
            p={"10px"}
            borderRadius={"8px"}
            border={"none"}
            bgColor={"#333"}
            color={"#c4c4c4"}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleComment();
                setCommentInput("");
              }
            }}
          />
          <Button
            w={"100px"}
            p={"10px"}
            borderRadius={"8px"}
            border={"none"}
            bgColor={"#333"}
            color={"#c4c4c4"}
            onClick={handleComment}
          >
            Gửi
          </Button>
        </HStack>
      </Box>
    </HStack>
  );
}
