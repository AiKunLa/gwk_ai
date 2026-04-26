/**
 * QueryProvider 组件
 *
 * React Query 的全局配置组件，负责：
 * 1. 创建 QueryClient 实例 - 管理所有查询和突变的状态
 * 2. 配置默认选项 - 设置全局的缓存、错误重试等行为
 * 3. 提供查询状态 - 展示全局加载状态
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

/**
 * QueryProviderProps
 * @property children - 应用子组件
 */
interface QueryProviderProps {
  children: ReactNode
}

/**
 * QueryProvider 组件实现
 *
 * 使用 React Query 官方推荐的方式创建 QueryClient：
 * - 使用 useState 确保只在客户端创建一次
 * - 在严格模式下会创建两次（开发环境正常行为）
 */
export function QueryProvider({ children }: QueryProviderProps) {
  /**
   * QueryClient 实例
   *
   * defaultOptions 中的配置说明：
   *
   * queries（查询配置）:
   * - staleTime: 60 * 1000 (60秒)
   *   数据在获取后 60 秒内被认为是"新鲜的"，不会自动重新获取
   *   设置较长的时间可以减少不必要的 API 请求
   *
   * - gcTime: 10 * 60 * 1000 (10分钟)
   *   未使用的数据在缓存中保留 10 分钟后被垃圾回收
   *   较长的 gcTime 可以让用户返回页面时看到缓存数据
   *
   * - retry: 1
   *   查询失败后自动重试 1 次
   *   适用于处理临时网络问题
   *
   * - refetchOnWindowFocus: false
   *   窗口重新获得焦点时不自动重新获取
   *   避免在切换标签页时产生不必要的请求
   *
   * mutations（突变配置）:
   * - retry: 0
   *   变更操作（POST/PUT/DELETE）不自动重试
   *   因为变更操作不是幂等的，重试可能导致数据重复创建
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 分钟内数据被视为新鲜
            gcTime: 10 * 60 * 1000, // 10 分钟后垃圾回收未使用的数据
            retry: 1, // 失败重试 1 次
            refetchOnWindowFocus: false, // 禁用窗口焦点重获取
          },
          mutations: {
            retry: 0, // 变更操作不重试
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default QueryProvider
