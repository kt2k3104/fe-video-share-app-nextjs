import { create } from "zustand";

export interface LogicState {
  isInitLogin: boolean;
  setIsInitLogin: (isInitLotin: boolean) => void;
}

const useLogic = create<LogicState>((set) => ({
  isInitLogin: false,
  setIsInitLogin: (isInitLogin: boolean) => set({ isInitLogin }),
}));

export default useLogic;
