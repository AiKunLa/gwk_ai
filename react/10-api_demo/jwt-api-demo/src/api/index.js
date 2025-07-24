import instance from "./config";




// 登录
export const login = (username, password) => {
    return instance.post('/login', {
        username,
        password
    })
}

/*
 * @description: 获取todos列表
 * @return {*}
 */
export const getTodos = () => {
    return instance.get('/todos')
}

