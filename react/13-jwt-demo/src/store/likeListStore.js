import { create } from "zustand";
import { getLikeList } from "@/api/user";
const useLikeListStore = create((set) => ({
  likeList: [],
  isLoading: false,
  error: null,
  fetchLikeList: async () => {
    try {
      set({
        isLoading: true,
      });
      const data = await getLikeList();
      set({
        likeList: data.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },
}));
export default useLikeListStore;
