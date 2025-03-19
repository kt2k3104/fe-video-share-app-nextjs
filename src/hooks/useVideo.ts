import { create } from "zustand";

export interface VideoState {
  videos: Video[];
  setVideos: (videos: Video[]) => void;
  updateVideos: (videos: Video[]) => void;
  pushVideo: (video: Video) => void;
  toggleLike: (videoId: number, userId: number) => void;
}

const useVideo = create<VideoState>((set) => ({
  videos: [],
  setVideos: (videos: Video[]) => set({ videos }),
  updateVideos: (videos: Video[]) => set((state: VideoState) => ({ videos })),
  pushVideo: (video: Video) =>
    set((state) => ({ videos: [...state.videos, video] })),
  toggleLike: (videoId: number, userId: number) =>
    set((state) => ({
      videos: state.videos.map((video) => {
        if (video.id === videoId) {
          const isLiked = video.likedUserIds.includes(userId);

          return {
            ...video,
            likes_count: isLiked
              ? video.likes_count - 1
              : video.likes_count + 1,
            likedUserIds: isLiked
              ? video.likedUserIds.filter((id) => id !== userId)
              : [...video.likedUserIds, userId],
          };
        }
        return video;
      }),
    })),
}));

export default useVideo;

export interface Video {
  id: number;
  user_id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  public_id: string;
  user: {
    id: number;
    avatar_url: string;
    username: string;
  };
  likedUserIds: number[];
  created_at: string;
  updated_at: string;
}
