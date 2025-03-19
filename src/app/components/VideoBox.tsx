import { Avatar } from "@/components/ui/avatar";
import useUserInfo, { UserInfoState } from "@/hooks/useUserInfo";
import useVideo, { Video, VideoState } from "@/hooks/useVideo";
import requestApi from "@/utils/api";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookmark, FaComment, FaHeart, FaShare } from "react-icons/fa";

export default function VideoBox({
  handleVolumeChange,
  videoRef,
  video,
  currentIndex,
}: {
  handleVolumeChange: any;
  videoRef: any;
  video: Video;
  currentIndex: number;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const myUserId = useUserInfo((state: UserInfoState) => state.userInfo?.id);
  const toggleLike = useVideo((state: VideoState) => state.toggleLike);

  const handleToggleLikeVideo = async () => {
    try {
      const response = await requestApi(
        `videos/${video.id}/like-toggle`,
        "GET",
        null
      );
      if (myUserId) toggleLike(video.id, +myUserId);
      if (response.data.message === "Like video successfully") {
        setIsLiked(true);
      } else if (response.data.message === "Unlike video successfully") {
        setIsLiked(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (myUserId && video.likedUserIds.includes(+myUserId)) {
      setIsLiked(true);
    }
  }, [myUserId]);

  return (
    <HStack h={"calc(100vh - 110px)"} alignItems={"flex-end"}>
      <Box h={"calc(100vh - 110px)"} p={"16px"}>
        <video
          src={video.url}
          controls
          autoPlay
          loop
          // muted
          style={{
            width: "auto",
            height: "100%",
            objectFit: "contain", // Đảm bảo toàn bộ video hiển thị
            backgroundColor: "black",
            borderRadius: "8px",
          }}
          ref={videoRef}
          onVolumeChange={handleVolumeChange}
        />
      </Box>
      <VStack p={"20px 0"} gap={"0"}>
        <Avatar
          name="avatar"
          src={video.user.avatar_url}
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          mb={"10px"}
          cursor={"pointer"}
          onClick={() => {
            router.push(`/${video.user.username}`);
          }}
        />
        <IconButton
          mt={"10px"}
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          flexShrink={"0"}
          borderRadius={"999px"}
          bgColor={"#333"}
          _hover={{ opacity: 0.8 }}
          onClick={() => handleToggleLikeVideo()}
        >
          <FaHeart color={isLiked ? "red" : "#c4c4c4"} />
        </IconButton>
        <Text>{video?.likes_count}</Text>

        <IconButton
          mt={"10px"}
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          flexShrink={"0"}
          borderRadius={"999px"}
          bgColor={"#333"}
          _hover={{ opacity: 0.8 }}
          onClick={() =>
            router.push(
              `${video.user.username}/video/${video.id}?videoIndex=${currentIndex}`
            )
          }
        >
          <FaComment color={"#c4c4c4"} />
        </IconButton>
        <Text>{video?.comments_count}</Text>

        <IconButton
          mt={"10px"}
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          flexShrink={"0"}
          borderRadius={"999px"}
          bgColor={"#333"}
          _hover={{ opacity: 0.8 }}
          onClick={() => setIsSaved(!isSaved)}
        >
          <FaBookmark color={isSaved ? "yellow" : "#c4c4c4"} />
        </IconButton>
        <Text>0</Text>

        <IconButton
          mt={"10px"}
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          flexShrink={"0"}
          borderRadius={"999px"}
          bgColor={"#333"}
          _hover={{ opacity: 0.8 }}
        >
          <FaShare color={"#c4c4c4"} />
        </IconButton>
        <Text>0</Text>
      </VStack>
    </HStack>
  );
}
