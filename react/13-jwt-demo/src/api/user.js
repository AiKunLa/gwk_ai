import instance  from "./config";

export const login = async (data) => {
    // 登录 设置请求体
    return await instance.post('/login', data)
}

export const getLikeList = async () => {
    const data = await instance.get('/getLikeList')
    return data
}
