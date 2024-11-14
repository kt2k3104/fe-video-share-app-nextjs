import { create } from "zustand";

export interface UserInfoState {
  userInfo: UserInfo | null;
  setUserInfo: (UserInfo: UserInfo) => void;
  followers: UserInfo[];
  setFollowers: (followers: UserInfo[]) => void;
  addFollowers: (followers: UserInfo) => void;
  removeFollowers: (followerId: string) => void;
  strangeUsers: StrangeUserInfo[];
  setStrangeUsers: (strangeUsers: StrangeUserInfo[]) => void;
  addStrangeUser: (strangeUser: StrangeUserInfo) => void;
  removeStrangeUser: (strangeUserId: string) => void;
}

export interface UserInfo {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  avatar_url: string;
  bio: string;
}

export type FollowRequest = {
  sender: UserInfo;
  message: string;
  createdAt: string;
};

export type StrangeUserInfo = UserInfo & {
  mutualFriends: UserInfo[];
};

const useUserInfo = create<UserInfoState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo }),

  followers: [],
  setFollowers: (followers: UserInfo[]) => set({ followers }),
  addFollowers: (follower: UserInfo) =>
    set((state) => ({
      followers: [...state.followers, follower],
      strangeUsers: state.strangeUsers.filter(
        (item) => item._id !== follower._id
      ),
    })),
  removeFollowers: (friendId: string) =>
    set((state) => ({
      followers: state.followers.filter((item) => item._id !== friendId),
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
        (item) => item._id !== strangeUserId
      ),
    })),
}));

export default useUserInfo;
