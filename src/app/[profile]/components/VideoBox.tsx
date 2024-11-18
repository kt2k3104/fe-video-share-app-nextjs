import { Box } from "@chakra-ui/react";
import { Video } from "../page";
import { useState } from "react";

export default function VideoBox({ video }: { video: Video }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      key={video.id}
      maxW={"320px"}
      m={"10px"}
      borderRadius={"10px"}
      overflow={"hidden"}
      position="relative"
      w="100%"
      cursor={"pointer"}
      _before={{
        content: '""',
        display: "block",
        paddingTop: "133.33%", // Tỷ lệ 4:3 (100% * 3 / 4)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered ? (
        <video
          src={video.url}
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <img
          src={video.thumbnail_url}
          alt={video.title}
          style={{
            width: "100%",
            height: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            objectFit: "cover",
          }}
        />
      )}
    </Box>
  );
}
