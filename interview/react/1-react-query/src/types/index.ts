/**
 * 用户数据类型定义
 * 模拟真实 API 返回的用户数据结构
 */
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive'
  createdAt: string
}

/**
 * 创建用户的请求参数
 * 不包含 id 和 createdAt，由后端生成
 */
export type CreateUserInput = Pick<User, 'name' | 'email' | 'role'>

/**
 * 更新用户的请求参数
 * id 来自路由参数，其余字段可选
 */
export type UpdateUserInput = Partial<Pick<User, 'name' | 'email' | 'role' | 'status'>>

/**
 * API 响应包装类型
 * 统一 API 响应格式，包含成功状态和数据/错误信息
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 分页参数
 * 用于列表查询时的分页控制
 */
export interface PaginationParams {
  page: number
  limit: number
}

/**
 * 分页响应
 * 包含数据总数和当前页数据
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}
