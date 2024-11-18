import { Avatar } from "@/components/ui/avatar";
import { Box, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { FaBookmark, FaComment, FaHeart, FaShare } from "react-icons/fa";

export default function VideoBox({
  handleVolumeChange,
  videoRefs,
  index,
  video,
}: {
  handleVolumeChange: any;
  videoRefs: any;
  index: number;
  video: any;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  return (
    <HStack h={"calc(100vh - 110px)"} alignItems={"flex-end"}>
      <Box h={"calc(100vh - 110px)"} p={"16px"}>
        <video
          src="https://res.cloudinary.com/dc4vad8tx/video/upload/v1731006428/video-share/videos/xhrkjavk9hdzitscbcil.mp4"
          //   src="https://res.cloudinary.com/dc4vad8tx/video/upload/v1731806383/video-share/videos/i0leo1cbluhtj35b2f6q.mp4"
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
          ref={(el: never) => (videoRefs.current[index] = el)}
          onVolumeChange={handleVolumeChange}
        />
      </Box>
      <VStack p={"20px 0"} gap={"0"}>
        <Avatar
          name="avatar"
          src=""
          maxW={"44px"}
          maxH={"44px"}
          w={"44px"}
          h={"44px"}
          mb={"10px"}
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
          onClick={() => setIsLiked(!isLiked)}
        >
          <FaHeart color={isLiked ? "red" : "#c4c4c4"} />
        </IconButton>
        <Text>{video?.likes_count ? video.likes_count : 0}</Text>

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
          <FaComment color={"#c4c4c4"} />
        </IconButton>
        <Text>{video?.comments_count ? video.comments_count : 0}</Text>

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
