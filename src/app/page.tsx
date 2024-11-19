"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { VStack } from "@chakra-ui/react";
import axios from "axios";
import VideoBox from "./components/VideoBox";
import useVideo, { Video, VideoState } from "@/hooks/useVideo";

export default function Home() {
  const pathname = usePathname(); // Theo dõi route hiện tại
  const videos = useVideo((state: VideoState) => state.videos);
  const setVideos = useVideo((state: VideoState) => state.setVideos);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRefs = useRef<HTMLVideoElement[]>([]); // Mảng ref chứa từng video
  const [currentIndex, setCurrentIndex] = useState(0); // Vị trí video hiện tại
  const [videoHeight, setVideoHeight] = useState(window.innerHeight - 102); // Chiều cao video
  const [volume, setVolume] = useState(1); // Âm lượng lưu trữ
  const isScrollingRef = useRef(false); // Cờ trạng thái cuộn
  const [isLoading, setIsLoading] = useState(true); // Trạng thái chờ dữ liệu từ API

  // Cập nhật chiều cao video khi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setVideoHeight(window.innerHeight - 102);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lấy danh sách video từ API và đánh dấu dữ liệu đã sẵn sàng
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:9000/api/v1/videos?page=1&limit=20"
        );
        setVideos(res.data.data);
        setIsLoading(false); // Dữ liệu đã sẵn sàng
      } catch (error) {
        console.error("Lỗi khi lấy video:", error);
      }
    };

    if (videos.length === 0) {
      setIsLoading(true); // Đặt trạng thái chờ
      fetchVideos();
    } else {
      setIsLoading(false); // Nếu đã có dữ liệu, bỏ qua tải
    }
  }, [setVideos, videos]);

  // Phục hồi âm lượng từ localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem("videoVolume");
    if (savedVolume) setVolume(parseFloat(savedVolume));
  }, []);

  // Reset trạng thái `currentIndex` khi pathname thay đổi
  useEffect(() => {
    setCurrentIndex(0); // Mỗi khi route thay đổi, reset về video đầu tiên
  }, [pathname]);

  // Phát video đầu tiên sau khi videos đã được tải
  useEffect(() => {
    if (!isLoading && videos.length > 0) {
      const firstVideo = videoRefs.current[0];
      if (firstVideo) {
        firstVideo.volume = volume; // Áp dụng âm lượng
        firstVideo.muted = false; // Đảm bảo bật âm thanh
        firstVideo
          .play()
          .catch((err) => console.error("Video không thể phát:", err));
      }
    }
  }, [isLoading, videos, volume]);

  // Điều khiển phát/dừng video khi thay đổi `currentIndex`
  useEffect(() => {
    if (!isLoading && videos.length > 0) {
      videoRefs.current.forEach((video, index) => {
        if (video) {
          if (index === currentIndex) {
            video.volume = volume; // Áp dụng âm lượng
            video.muted = false; // Đảm bảo bật âm thanh
            video
              .play()
              .catch((err) => console.error("Video không thể phát:", err));
          } else {
            video.pause();
            video.currentTime = 0; // Đặt lại thời gian video
          }
        }
      });

      // Cuộn tới video hiện tại
      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: currentIndex * videoHeight,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex, videoHeight, volume, isLoading, videos]);

  // Xử lý cuộn chuột để thay đổi video
  const handleScroll = (e: React.WheelEvent) => {
    if (isScrollingRef.current) return; // Ngăn chặn cuộn liên tục

    if (e.deltaY > 0 && currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Cuộn xuống
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // Cuộn lên
    }

    isScrollingRef.current = true;
    setTimeout(() => (isScrollingRef.current = false), 300); // Reset cờ sau 300ms
  };

  // Cập nhật âm lượng khi người dùng thay đổi
  const handleVolumeChange = (e: React.ChangeEvent<HTMLVideoElement>) => {
    const newVolume = e.target.volume;
    setVolume(newVolume);
    localStorage.setItem("videoVolume", newVolume.toString()); // Lưu âm lượng
  };

  useEffect(() => {
    document.title = "Trang chủ";
  }, []);

  return (
    <VStack
      flex={"1"}
      h={"calc(100vh - 110px)"}
      overflow={"hidden"}
      scrollSnapType={"y mandatory"}
      ref={containerRef}
      onWheel={handleScroll}
      bgColor={"#111"}
    >
      {isLoading ? (
        <p style={{ color: "white" }}>Đang tải video...</p>
      ) : (
        videos.map((video: Video, index) => (
          <VideoBox
            key={video.id}
            video={video}
            videoRef={(el: any) => (videoRefs.current[index] = el!)} // Gán ref cho từng video
            handleVolumeChange={handleVolumeChange} // Lắng nghe thay đổi âm lượng
          />
        ))
      )}
    </VStack>
  );
}
