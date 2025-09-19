import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
  }),
  actions: {
    setToken(token:string) {
      this.token = token
      localStorage.setItem("token", token)
    },
    setUsername(username:string) {
      this.username = username
      localStorage.setItem("username", username)
    },
    logout() {
        this.token = ""
        this.username = ""
        localStorage.removeItem("token")
        localStorage.removeItem("username")
    }
  },
  getters: {
    // 计算属性 依赖于响应式状态计算的结果
    isLogin(): boolean {
      // 使用 !! 将 token 转换为布尔值
      return !!this.token;
    },
  },
});
