import { create } from "zustand";

export interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (UserInfo: UserInfo | null) => void;

  followers: UserInfo[];
  setFollowers: (followers: UserInfo[]) => void;
  addFollowers: (followers: UserInfo) => void;
  removeFollowers: (followerId: string) => void;

  followings: UserInfo[];
  setFollowings: (followings: UserInfo[]) => void;
  addFollowings: (followings: UserInfo) => void;
  removeFollowings: (followingId: string) => void;

  strangeUsers: StrangeUserInfo[];
  setStrangeUsers: (strangeUsers: StrangeUserInfo[]) => void;
  addStrangeUser: (strangeUser: StrangeUserInfo) => void;
  removeStrangeUser: (strangeUserId: string) => void;

  myVideos: MyVideo[];
  setMyVideos: (videos: MyVideo[]) => void;
  addMyVideos: (video: MyVideo) => void;
  removeMyVideos: (videoId: string) => void;
}

export interface UserInfo {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
}

export type FollowRequest = {
  sender: UserInfo;
  message: string;
  createdAt: string;
};

export interface MyVideo {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
}

export type StrangeUserInfo = UserInfo & {
  mutualFriends: UserInfo[];
};

const useUserInfo = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: UserInfo | null) => set({ userInfo }),

  followers: [],
  setFollowers: (followers: UserInfo[]) => set({ followers }),
  addFollowers: (follower: UserInfo) =>
    set((state) => ({
      followers: [...state.followers, follower],
      strangeUsers: state.strangeUsers.filter(
        (item) => item.id !== follower.id
      ),
    })),
  removeFollowers: (userId: string) =>
    set((state) => ({
      followers: state.followers.filter((item) => +item.id !== +userId),
    })),

  followings: [],
  setFollowings: (followings: UserInfo[]) => set({ followings }),
  addFollowings: (following: UserInfo) =>
    set((state) => ({
      followings: [...state.followings, following],
    })),
  removeFollowings: (userId: string) =>
    set((state) => ({
      followings: state.followings.filter((item) => +item.id !== +userId),
    })),

  strangeUsers: [],
  setStrangeUsers: (strangeUsers: StrangeUserInfo[]) => set({ strangeUsers }),
  addStrangeUser: (strangeUser: StrangeUserInfo) =>
    set((state) => ({
      strangeUsers: [...state.strangeUsers, strangeUser],
    })),
  removeStrangeUser: (strangeUserId: string) =>
    set((state) => ({
      strangeUsers: state.strangeUsers.filter(
        (item) => item.id !== strangeUserId
      ),
    })),

  myVideos: [],
  setMyVideos: (videos: MyVideo[]) => set({ myVideos: videos }),
  addMyVideos: (video: MyVideo) =>
    set((state) => ({
      myVideos: [...state.myVideos, video],
    })),
  removeMyVideos: (videoId: string) =>
    set((state) => ({
      myVideos: state.myVideos.filter((item) => +item.id !== +videoId),
    })),
}));

export default useUserInfo;
