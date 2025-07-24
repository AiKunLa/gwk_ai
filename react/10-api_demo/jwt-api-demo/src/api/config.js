import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5173/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 配置axios的baseURL 之后的所有请求的url都会自动加上这个baseURL，之后只需要修改这个即可，改为线上地址

// axios.defaults.baseURL = 'http'
// axios 标准的http请求库

// 请求拦截器
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
instance.interceptors.response.use((response) => {
  return response.data;
});

export default instance;
