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
    // 结构响应的数据
    const { code, msg, data: userData } = res.data;

    const { token, user } = userData;
    // 若登录成功则 设置登录成功信息，并存储token到localStorage中
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
