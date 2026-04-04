/**
 * QueryProvider - TanStack Query 全局状态管理组件
 *
 * 作用：
 * - 为整个应用提供 React Query 的查询客户端
 * - 配置全局查询/变更的默认行为
 * - 统一管理服务端状态缓存
 *
 * 配置说明：
 * - staleTime: 60s - 数据在获取后 60 秒内被认为是新鲜的
 * - gcTime: 10min - 未使用的数据在缓存中保留 10 分钟后被垃圾回收
 * - retry: 1 - 查询失败后自动重试 1 次
 * - refetchOnWindowFocus: false - 窗口重新获得焦点时不自动重新获取
 * - mutations.retry: 0 - 变更操作（POST/PUT/DELETE）不重试
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react";

interface QueryProviderProps {
    /** 应用子组件 */
    children: React.ReactNode;
}


export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = React.useState(
        () => new QueryClient({
            defaultOptions: {
                // 全局查询配置
                queries: {
                    staleTime: 60 * 1000, // 1 分钟内数据被视为新鲜
                    gcTime: 10 * 60 * 1000, // 10 分钟后垃圾回收未使用的数据
                    retry: 1, // 失败重试 1 次
                    refetchOnWindowFocus: false, // 禁用窗口焦点重获取
                },
                // 全局变更操作配置
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