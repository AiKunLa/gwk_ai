import axios from "axios";
import type { AxiosResponse, AxiosRequestConfig } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
  // 跨域请求时是否需要使用凭证
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 发起网络请求的通用方法
 * @param config - Axios 请求配置对象
 * @returns 返回一个 Promise，解析为 AxiosResponse 类型的数据
 * @typeParam T - 响应数据的类型 
 * @description 该方法使用 Axios 发起网络请求，并返回一个 Promise，解析为 AxiosResponse 类型的数据。
 * 可以通过泛型参数 T 指定响应数据的类型，以获得类型安全的响应数据。
 */
export const request = <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  return instance(config);
};

export default instance;
