"use client";
import { Box, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import VideoBox from "./components/VideoBox";

export default function Home() {
  // const containerRef = useRef(null);
  // const videoRefs = useRef([]); // Mảng ref chứa từng video
  // const [currentIndex, setCurrentIndex] = useState(0); // Vị trí video hiện tại
  // const [videoHeight, setVideoHeight] = useState(0); // Chiều cao thực tế của video
  // const isScrollingRef = useRef(false); // Cờ trạng thái kiểm soát cuộn
  // const [volume, setVolume] = useState(1); // Lưu âm lượng chung cho tất cả video

  // // Cập nhật chiều cao video mỗi khi thay đổi kích thước màn hình
  // useEffect(() => {
  //   const updateVideoHeight = () => {
  //     setVideoHeight(window.innerHeight - 102); // 100vh - header/padding
  //   };

  //   updateVideoHeight(); // Cập nhật ngay lần đầu
  //   window.addEventListener("resize", updateVideoHeight); // Lắng nghe thay đổi kích thước
  //   return () => window.removeEventListener("resize", updateVideoHeight);
  // }, []);

  // const handleScroll = (e: any) => {
  //   e.preventDefault();

  //   if (isScrollingRef.current) return; // Nếu đang cuộn, bỏ qua sự kiện mới

  //   const container: any = containerRef.current;
  //   const totalVideos = container.children.length;

  //   if (e.deltaY > 0 && currentIndex < totalVideos - 1) {
  //     // Cuộn xuống
  //     setCurrentIndex((prev) => prev + 1);
  //   } else if (e.deltaY < 0 && currentIndex > 0) {
  //     // Cuộn lên
  //     setCurrentIndex((prev) => prev - 1);
  //   }

  //   // Đặt cờ trạng thái để ngăn cuộn nhiều lần liên tiếp
  //   isScrollingRef.current = true;
  //   setTimeout(() => {
  //     isScrollingRef.current = false; // Reset cờ sau 300ms
  //   }, 300);
  // };

  // const handleVolumeChange = (e: any) => {
  //   const newVolume = e.target.volume;
  //   setVolume(newVolume);

  //   // Lưu âm lượng vào localStorage để các video khác có thể dùng
  //   localStorage.setItem("videoVolume", newVolume);
  // };

  // useEffect(() => {
  //   const container: any = containerRef.current;

  //   if (container) {
  //     container.style.scrollBehavior = "smooth";
  //     container.scrollTo({
  //       top: currentIndex * videoHeight, // Cuộn theo chiều cao thực tế
  //       behavior: "smooth",
  //     });
  //   }

  //   // Điều khiển video chạy/dừng
  //   videoRefs.current.forEach((video: any, index) => {
  //     if (video) {
  //       if (index === currentIndex) {
  //         video.play(); // Chỉ phát video tại vị trí hiện tại
  //       } else {
  //         video.pause(); // Dừng các video khác
  //         video.currentTime = 0; // Đặt lại thời gian về 0
  //       }
  //     }
  //   });
  // }, [currentIndex, videoHeight]);

  // // Khởi tạo: Phát video đầu tiên khi load trang
  // useEffect(() => {
  //   const video: any = videoRefs.current[0];
  //   if (video) {
  //     video.muted = true;
  //     video.play().catch((error: any) => {
  //       console.error("Video không thể phát tự động:", error);
  //     });
  //   }
  // }, []);

  // // Phục hồi âm lượng từ localStorage khi trang được tải lại
  // useEffect(() => {
  //   const savedVolume = localStorage.getItem("videoVolume");
  //   if (savedVolume !== null) {
  //     setVolume(parseFloat(savedVolume));
  //   }
  // }, []);

  // useEffect(() => {
  //   // Khi volume thay đổi, cập nhật tất cả các video
  //   videoRefs.current.forEach((video: any) => {
  //     video.volume = volume;
  //   });
  // }, [volume]);

  return (
    <VStack
      flex={"1"}
      h={"calc(100vh - 110px)"}
      overflow={"hidden"}
      scrollSnapType={"y mandatory"}
      // ref={containerRef}
      // onWheel={handleScroll}
      bgColor={"#111"}
    >
      {/* <VideoBox
        handleVolumeChange={handleVolumeChange}
        videoRefs={videoRefs}
        index={0}
        video={1}
      /> */}
      {/* <Box h={"calc(100vh - 110px)"} p={"16px"}>
        <video
          src="https://res.cloudinary.com/dc4vad8tx/video/upload/v1731006428/video-share/videos/xhrkjavk9hdzitscbcil.mp4"
          //   src="https://res.cloudinary.com/dc4vad8tx/video/upload/v1731806383/video-share/videos/i0leo1cbluhtj35b2f6q.mp4"
          controls
          autoPlay
          loop
          muted
          style={{
            width: "auto",
            height: "100%",
            objectFit: "contain", // Đảm bảo toàn bộ video hiển thị
            backgroundColor: "black",
            borderRadius: "8px",
          }}
          ref={(el: never) => (videoRefs.current[0] = el)}
          onVolumeChange={handleVolumeChange}
        />
      </Box> */}
      <video
        // src={video.url}
        src="https://res.cloudinary.com/dc4vad8tx/video/upload/v1731006428/video-share/videos/xhrkjavk9hdzitscbcil.mp4"
        autoPlay
        muted
        loop
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Text>hihihihi</Text>
    </VStack>
  );
}
