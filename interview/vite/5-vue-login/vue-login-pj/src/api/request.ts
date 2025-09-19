import axios, { type AxiosInstance } from "axios";

const service: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // IMPORTANT: must return config
  },
  (error) => {
    if (error.response?.state === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error)
  }
);

service.interceptors.response.use((response) => {
  const { data, code, message } = response.data;
  if (code === 200 || code === 0) return data;
  else console.log("失败了...");
  return Promise.reject(new Error(message || "请求失败"));
});

export default service;
