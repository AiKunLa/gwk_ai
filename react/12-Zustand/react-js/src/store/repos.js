import { getReps, getRepoList } from "@/api/repo";

import { create } from "zustand";

export const useRepoStore = create((set) => ({
  repos: [],
  loading: false,
  error: null,
  fetchRepoList: async (owner) => {
    set({ loading: true });
    try {
      const data = await getRepoList(owner);
      console.log(data)
      set({ repos: data, loading: false });
    } catch (error) {
      set({ loading: false, error });
    }
  },
}));
