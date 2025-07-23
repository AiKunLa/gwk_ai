import axios from "axios";

// 配置基地址
// 拦截请求，添加token
const instance = axios.create({
  baseURL: "http://localhost:5173",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// 拦截请求，添加token   config 是请求配置对象
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 拦截响应，处理token
// instance.interceptors.response.use((response) => {
//   const token = response.headers["authorization"].split(" ")[1];
//   if (token) {
//     localStorage.setItem("token", token);
//   }
//   return response;
// });

// 导出实例
export default instance;
