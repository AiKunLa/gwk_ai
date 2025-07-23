import { create } from "zustand";
import { login } from "@/api/user";

const tokenKey = "token";

const useUserStore = create((set) => ({
  user: null, // {userId,username}
  isLogin: false,
  token: "",
  loading: false,
  error: null,

  setError: (error) => {
    set({ error });
  },

  login: async (data) => {
    set({ loading: true });
    const res = await login(data);

    const { code, msg, data: userData } = res.data;
    console.log("=========================");
    const { token, user } = userData;
    if (code === 0) {
      set({
        user: user,
        isLogin: true,
        token: token,
        loading: false,
      });
      // 存储token
      localStorage.setItem(tokenKey, token);
    } else {
      set({
        loading: false,
        error: msg,
      });
    }
  },

  logout: () => {
    set({
      user: null,
      isLogin: false,
      token: "",
    });
    // 清除本地存储
    localStorage.removeItem(tokenKey);
  },
}));

export { useUserStore };
