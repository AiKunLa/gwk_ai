import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body || {}
      if (username === 'admin' && password === '123456') {
        return { code: 0, data: { token: 'mock-token', username } }
      }
      return { code: 1, message: '用户名或密码错误' }
    },
  },
] as MockMethod[]
