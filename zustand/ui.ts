import { create } from "zustand";

interface UIModel {
  isClosed: boolean;
  setIsClosed: (isClosed: boolean) => void;
}

const useUIModelStore = create<UIModel>((set) => ({
  isClosed: false,
  setIsClosed: (isClosed) => set({ isClosed }),
}));

export default useUIModelStore;
