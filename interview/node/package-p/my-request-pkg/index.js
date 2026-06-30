import axios from 'axios';

// 1. 把写死的 URL 改成“可配置的”，由外部传入
export const createRequest = (config) => {
    const instance = axios.create({
        baseURL: config.baseURL, // 现在由项目B传入
        timeout: 10000,
    });

    // 2. 拦截器里的“弹窗报错”和“token获取”，全部改成调用外部传入的回调函数
    instance.interceptors.request.use((req) => {
        // 不再写死 useUserStore，而是调用外部传进来的 getToken 方法
        const token = config.getToken ? config.getToken() : null;
        if (token) req.headers.Authorization = `Bearer ${token}`;
        return req;
    });

    instance.interceptors.response.use(
        (res) => res.data,
        (error) => {
            // 不再写死 ElMessage，而是调用外部传进来的 onError 方法
            if (config.onError) {
                config.onError(error.response?.status, error.message);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};