/**
 * Mock API 模块
 *
 * 本模块模拟后端 REST API 的行为，通过 setTimeout 添加人工延迟来模拟网络请求。
 * 数据存储在内存中，页面刷新后数据会重置。
 *
 * 延迟时间：
 * - GET 请求: 300-500ms (模拟读取)
 * - POST/PUT/DELETE 请求: 500ms (模拟写入)
 */

import type { User, CreateUserInput, UpdateUserInput, ApiResponse } from '../types'

/**
 * 每页显示的用户数量
 */
const PAGE_SIZE = 5

/**
 * 模拟数据库 - 初始用户数据
 * 使用内存存储，页面刷新后重置
 * 为支持无限滚动，生成更多测试数据
 */
let users: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z' },
  { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active', createdAt: '2024-02-20T10:30:00Z' },
  { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-10T14:45:00Z' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'guest', status: 'active', createdAt: '2024-04-05T09:15:00Z' },
  { id: 5, name: '孙七', email: 'sunqi@example.com', role: 'user', status: 'active', createdAt: '2024-04-10T11:20:00Z' },
  { id: 6, name: '周八', email: 'zhouba@example.com', role: 'guest', status: 'active', createdAt: '2024-04-15T08:45:00Z' },
  { id: 7, name: '吴九', email: 'wujiu@example.com', role: 'admin', status: 'active', createdAt: '2024-04-20T14:30:00Z' },
  { id: 8, name: '郑十', email: 'zhengshi@example.com', role: 'user', status: 'inactive', createdAt: '2024-04-25T16:00:00Z' },
  { id: 9, name: '钱一', email: 'qianyi@example.com', role: 'user', status: 'active', createdAt: '2024-05-01T09:00:00Z' },
  { id: 10, name: '高二', email: 'gaoer@example.com', role: 'guest', status: 'active', createdAt: '2024-05-05T10:15:00Z' },
  { id: 11, name: '林三', email: 'linsan@example.com', role: 'user', status: 'active', createdAt: '2024-05-10T11:30:00Z' },
  { id: 12, name: '陈四', email: 'chensi@example.com', role: 'admin', status: 'active', createdAt: '2024-05-15T13:45:00Z' },
  { id: 13, name: '黄五', email: 'huangwu@example.com', role: 'user', status: 'inactive', createdAt: '2024-05-20T15:00:00Z' },
  { id: 14, name: '杨六', email: 'yangliu@example.com', role: 'guest', status: 'active', createdAt: '2024-05-25T16:30:00Z' },
  { id: 15, name: '赵七', email: 'zhaoqi@example.com', role: 'user', status: 'active', createdAt: '2024-06-01T08:00:00Z' },
  { id: 16, name: '王八', email: 'wangba@example.com', role: 'user', status: 'active', createdAt: '2024-06-05T09:30:00Z' },
  { id: 17, name: '李九', email: 'lijiu@example.com', role: 'admin', status: 'inactive', createdAt: '2024-06-10T10:45:00Z' },
  { id: 18, name: '刘十', email: 'liushi@example.com', role: 'guest', status: 'active', createdAt: '2024-06-15T12:00:00Z' },
  { id: 19, name: '陈一', email: 'chenyi@example.com', role: 'user', status: 'active', createdAt: '2024-06-20T14:15:00Z' },
  { id: 20, name: '周二', email: 'zhouer@example.com', role: 'user', status: 'active', createdAt: '2024-06-25T15:30:00Z' },
]

/**
 * 下一个可用的用户 ID
 * 每次创建用户时自增
 */
let nextId = 5

/**
 * 模拟网络延迟
 * @param ms 延迟毫秒数
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 获取用户列表
 *
 * 模拟 GET /api/users 端点
 * 返回所有用户，支持模糊搜索（通过 name 参数）
 *
 * @param searchTerm - 可选的搜索词，用于过滤用户名
 * @returns Promise<ApiResponse<User[]>> - 用户列表或错误信息
 */
export async function getUsers(searchTerm?: string): Promise<ApiResponse<User[]>> {
  // 模拟网络延迟 500ms
  await delay(500)

  try {
    let filteredUsers = users

    // 如果有搜索词，执行客户端过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    }

    return {
      success: true,
      data: filteredUsers,
    }
  } catch {
    return {
      success: false,
      error: '获取用户列表失败',
    }
  }
}

/**
 * 获取单个用户
 *
 * 模拟 GET /api/users/:id 端点
 * 根据 ID 获取用户详情
 *
 * @param id - 用户 ID
 * @returns Promise<ApiResponse<User>> - 用户信息或错误信息
 */
export async function getUserById(id: number): Promise<ApiResponse<User>> {
  // 模拟网络延迟 300ms（单个用户查询较快）
  await delay(300)

  const user = users.find((u) => u.id === id)

  if (!user) {
    return {
      success: false,
      error: `用户 ID ${id} 不存在`,
    }
  }

  return {
    success: true,
    data: user,
  }
}

/**
 * 创建用户
 *
 * 模拟 POST /api/users 端点
 * 创建新用户并返回创建后的完整用户对象
 *
 * @param input - 创建用户的输入数据（name, email, role）
 * @returns Promise<ApiResponse<User>> - 创建的用户或错误信息
 */
export async function createUser(input: CreateUserInput): Promise<ApiResponse<User>> {
  // 模拟网络延迟 500ms（写操作通常比读操作慢）
  await delay(500)

  // 检查邮箱是否已被使用
  const existingUser = users.find((u) => u.email === input.email)
  if (existingUser) {
    return {
      success: false,
      error: '该邮箱已被注册',
    }
  }

  // 创建新用户
  const newUser: User = {
    id: nextId++,
    ...input,
    status: 'active',
    createdAt: new Date().toISOString(),
  }

  // 保存到内存数据库
  users.push(newUser)

  return {
    success: true,
    data: newUser,
  }
}

/**
 * 更新用户
 *
 * 模拟 PUT /api/users/:id 端点
 * 更新指定用户的字段
 *
 * @param id - 用户 ID
 * @param input - 要更新的字段
 * @returns Promise<ApiResponse<User>> - 更新后的用户或错误信息
 */
export async function updateUser(id: number, input: UpdateUserInput): Promise<ApiResponse<User>> {
  // 模拟网络延迟 500ms
  await delay(500)

  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex === -1) {
    return {
      success: false,
      error: `用户 ID ${id} 不存在`,
    }
  }

  // 如果更新邮箱，检查是否与其他用户冲突
  if (input.email) {
    const emailExists = users.some((u) => u.email === input.email && u.id !== id)
    if (emailExists) {
      return {
        success: false,
        error: '该邮箱已被其他用户使用',
      }
    }
  }

  // 合并更新用户数据
  const updatedUser: User = {
    ...users[userIndex],
    ...input,
  }

  users[userIndex] = updatedUser

  return {
    success: true,
    data: updatedUser,
  }
}

/**
 * 删除用户
 *
 * 模拟 DELETE /api/users/:id 端点
 * 从数据库中删除指定用户
 *
 * @param id - 用户 ID
 * @returns Promise<ApiResponse<null>> - 成功或错误信息
 */
export async function deleteUser(id: number): Promise<ApiResponse<null>> {
  // 模拟网络延迟 500ms
  await delay(500)

  const userIndex = users.findIndex((u) => u.id === id)

  if (userIndex === -1) {
    return {
      success: false,
      error: `用户 ID ${id} 不存在`,
    }
  }

  // 从数组中删除用户
  users.splice(userIndex, 1)

  return {
    success: true,
    data: null,
  }
}

/**
 * 获取分页用户列表（用于无限滚动）
 *
 * 模拟 GET /api/users/paginated 端点
 * 返回指定页码的用户数据，包含分页元信息
 *
 * @param page - 页码（从 1 开始）
 * @param pageSize - 每页数量
 * @returns Promise 包含用户列表和分页信息
 */
export async function getPaginatedUsers(
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<ApiResponse<{
  items: User[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}>> {
  // 模拟网络延迟 500ms
  await delay(500)

  try {
    // 计算分页索引
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    // 获取对应页的数据
    const items = users.slice(startIndex, endIndex)
    const total = users.length
    const hasMore = endIndex < total

    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        hasMore,
      },
    }
  } catch {
    return {
      success: false,
      error: '获取用户列表失败',
    }
  }
}

/**
 * 重置模拟数据
 * 用于测试目的，将用户列表恢复为初始状态
 */
export function resetMockData(): void {
  users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15T08:00:00Z' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user', status: 'active', createdAt: '2024-02-20T10:30:00Z' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user', status: 'inactive', createdAt: '2024-03-10T14:45:00Z' },
    { id: 4, name: '赵六', email: 'zhaoliu@example.com', role: 'guest', status: 'active', createdAt: '2024-04-05T09:15:00Z' },
    { id: 5, name: '孙七', email: 'sunqi@example.com', role: 'user', status: 'active', createdAt: '2024-04-10T11:20:00Z' },
    { id: 6, name: '周八', email: 'zhouba@example.com', role: 'guest', status: 'active', createdAt: '2024-04-15T08:45:00Z' },
    { id: 7, name: '吴九', email: 'wujiu@example.com', role: 'admin', status: 'active', createdAt: '2024-04-20T14:30:00Z' },
    { id: 8, name: '郑十', email: 'zhengshi@example.com', role: 'user', status: 'inactive', createdAt: '2024-04-25T16:00:00Z' },
    { id: 9, name: '钱一', email: 'qianyi@example.com', role: 'user', status: 'active', createdAt: '2024-05-01T09:00:00Z' },
    { id: 10, name: '高二', email: 'gaoer@example.com', role: 'guest', status: 'active', createdAt: '2024-05-05T10:15:00Z' },
    { id: 11, name: '林三', email: 'linsan@example.com', role: 'user', status: 'active', createdAt: '2024-05-10T11:30:00Z' },
    { id: 12, name: '陈四', email: 'chensi@example.com', role: 'admin', status: 'active', createdAt: '2024-05-15T13:45:00Z' },
    { id: 13, name: '黄五', email: 'huangwu@example.com', role: 'user', status: 'inactive', createdAt: '2024-05-20T15:00:00Z' },
    { id: 14, name: '杨六', email: 'yangliu@example.com', role: 'guest', status: 'active', createdAt: '2024-05-25T16:30:00Z' },
    { id: 15, name: '赵七', email: 'zhaoqi@example.com', role: 'user', status: 'active', createdAt: '2024-06-01T08:00:00Z' },
    { id: 16, name: '王八', email: 'wangba@example.com', role: 'user', status: 'active', createdAt: '2024-06-05T09:30:00Z' },
    { id: 17, name: '李九', email: 'lijiu@example.com', role: 'admin', status: 'inactive', createdAt: '2024-06-10T10:45:00Z' },
    { id: 18, name: '刘十', email: 'liushi@example.com', role: 'guest', status: 'active', createdAt: '2024-06-15T12:00:00Z' },
    { id: 19, name: '陈一', email: 'chenyi@example.com', role: 'user', status: 'active', createdAt: '2024-06-20T14:15:00Z' },
    { id: 20, name: '周二', email: 'zhouer@example.com', role: 'user', status: 'active', createdAt: '2024-06-25T15:30:00Z' },
  ]
  nextId = 21
}
