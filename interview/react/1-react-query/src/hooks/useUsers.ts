/**
 * useUsers hooks 模块
 *
 * 封装 React Query 的 useQuery、useInfiniteQuery 和 useMutation，提供类型安全的用户数据操作。
 * 遵循 React Query 最佳实践：
 * - 使用 queryKey 进行查询缓存管理
 * - 提供乐观更新支持
 * - 统一的错误处理
 */

import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import type { User, CreateUserInput, UpdateUserInput } from '../types'
import {
  getUsers,
  getUserById,
  getPaginatedUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../api/mock'

/**
 * React Query 的 queryKey 工厂函数
 * 用于生成一致的查询键，便于缓存管理和失效操作
 */
export const queryKeys = {
  /**
   * 用户列表查询键
   * @param searchTerm - 可选的搜索词
   */
  users: (searchTerm?: string) => ['users', searchTerm] as const,

  /**
   * 单个用户查询键
   * @param id - 用户 ID
   */
  user: (id: number) => ['user', id] as const,
}

/**
 * 获取用户列表
 *
 * useQuery hook 的封装，提供：
 * - 自动缓存管理
 * - 加载状态追踪
 * - 错误处理
 *
 * @param searchTerm - 可选的搜索词，用于过滤用户
 * @returns UseQueryResult<User[], Error> - 包含 data, isLoading, error 等状态
 *
 * @example
 * const { data, isLoading, error } = useUsers()
 */
export function useUsers(searchTerm?: string): UseQueryResult<User[], Error> {
  return useQuery({
    /**
     * queryKey: ['users', searchTerm]
     * - React Query 使用此键缓存查询结果
     * - 传入 searchTerm 可以缓存不同搜索条件的结果
     */
    queryKey: queryKeys.users(searchTerm),

    /**
     * queryFn: 异步查询函数
     * - 必须是返回 Promise 的函数
     * - 抛出的错误会被 React Query 捕获
     */
    queryFn: () => getUsers(searchTerm).then((res) => {
      if (!res.success) {
        throw new Error(res.error || '获取用户列表失败')
      }
      return res.data!
    }),
  })
}

/**
 * 获取单个用户详情
 *
 * 根据用户 ID 获取用户信息
 *
 * @param id - 用户 ID，如果为 undefined 则不会发送请求
 * @returns UseQueryResult<User, Error>
 */
export function useUser(id?: number): UseQueryResult<User, Error> {
  return useQuery({
    queryKey: queryKeys.user(id!),

    /**
     * enabled: false 时不发送请求
     * 用于处理 id 为 undefined 的情况
     */
    enabled: id !== undefined,

    queryFn: () => getUserById(id!).then((res) => {
      if (!res.success) {
        throw new Error(res.error || '获取用户详情失败')
      }
      return res.data!
    }),
  })
}

/**
 * 创建用户
 *
 * useMutation hook 的封装，提供：
 * - 乐观更新支持
 * - 自动缓存失效
 * - 错误回滚
 *
 * @returns UseMutationResult<User, Error, CreateUserInput>
 */
export function useCreateUser(): UseMutationResult<User, Error, CreateUserInput> {
  const queryClient = useQueryClient()

  return useMutation({
    /**
     * mutationFn: 执行创建用户的异步操作
     */
    mutationFn: (input) => createUser(input).then((res) => {
      if (!res.success) {
        throw new Error(res.error || '创建用户失败')
      }
      return res.data!
    }),

    /**
     * onMutate: 乐观更新前的回调
     * 在 mutation 执行前立即更新 UI，提供即时反馈
     *
     * 步骤：
     * 1. 取消所有正在进行的查询（防止与乐观更新冲突）
     * 2. 保存当前数据快照，用于错误回滚
     * 3. 立即更新缓存数据
     */
    onMutate: async (newUser) => {
      // 取消所有用户列表的正在进行的请求
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // 保存当前数据快照
      const previousUsers = queryClient.getQueryData<User[]>(['users', undefined])

      // 立即更新缓存（乐观更新）
      const optimisticUser: User = {
        id: Date.now(),
        ...newUser,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      queryClient.setQueryData<User[]>(['users', undefined], (old) =>
        old ? [...old, optimisticUser] : [optimisticUser]
      )

      // 返回上下文对象，包含快照数据
      return { previousUsers }
    },

    /**
     * onError: mutation 失败时的回调
     * 执行错误回滚，恢复到乐观更新前的状态
     */
    onError: (_err, _newUser, context) => {
      // 如果有快照，则恢复数据
      if (context?.previousUsers) {
        queryClient.setQueryData(['users', undefined], context.previousUsers)
      }
    },

    /**
     * onSettled: mutation 完成后（无论成功或失败）调用
     * 用于确保缓存与服务器数据同步
     */
    onSettled: () => {
      // 失效用户列表缓存，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * 更新用户
 *
 * 乐观更新示例：立即更新 UI，失败时回滚
 *
 * @returns UseMutationResult<User, Error, { id: number; input: UpdateUserInput }>
 */
export function useUpdateUser(): UseMutationResult<User, Error, { id: number; input: UpdateUserInput }> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }) => updateUser(id, input).then((res) => {
      if (!res.success) {
        throw new Error(res.error || '更新用户失败')
      }
      return res.data!
    }),

    onMutate: async ({ id, input }) => {
      // 取消所有用户相关查询
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // 保存快照
      const previousUsers = queryClient.getQueryData<User[]>(['users', undefined])
      const previousUser = queryClient.getQueryData<User>(['user', id])

      // 乐观更新 - 立即更新列表中的用户
      queryClient.setQueryData<User[]>(['users', undefined], (old) =>
        old?.map((user) => (user.id === id ? { ...user, ...input } : user))
      )

      // 乐观更新 - 立即更新单个用户缓存
      if (previousUser) {
        queryClient.setQueryData<User>(['user', id], (old) =>
          old ? { ...old, ...input } : old
        )
      }

      return { previousUsers, previousUser }
    },

    onError: (_err, variables, context) => {
      // 回滚列表数据
      if (context?.previousUsers) {
        queryClient.setQueryData(['users', undefined], context.previousUsers)
      }
      // 回滚单个用户数据
      if (context?.previousUser) {
        queryClient.setQueryData(['user', variables.id], context.previousUser)
      }
    },

    onSettled: (_, __, variables) => {
      // 失效相关缓存，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) })
    },
  })
}

/**
 * 删除用户
 *
 * @returns UseMutationResult<void, Error, number> - 删除的用户 ID
 */
export function useDeleteUser(): UseMutationResult<void, Error, number> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => deleteUser(id).then((res) => {
      if (!res.success) {
        throw new Error(res.error || '删除用户失败')
      }
    }),

    onMutate: async (id) => {
      // 取消所有用户查询
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // 保存快照
      const previousUsers = queryClient.getQueryData<User[]>(['users', undefined])

      // 乐观更新 - 立即从列表中移除
      queryClient.setQueryData<User[]>(['users', undefined], (old) =>
        old?.filter((user) => user.id !== id)
      )

      return { previousUsers }
    },

    onError: (_err, _id, context) => {
      // 回滚数据
      if (context?.previousUsers) {
        queryClient.setQueryData(['users', undefined], context.previousUsers)
      }
    },

    onSettled: () => {
      // 失效缓存
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

/**
 * 无限滚动获取用户列表
 *
 * useInfiniteQuery hook 的封装，提供：
 * - 自动分页加载
 * - hasNextPage / fetchNextPage 支持
 * - 所有页数据的扁平化展开
 *
 * @returns useInfiniteQuery 返回的结果，包含 data, hasNextPage, fetchNextPage 等
 */
export function useInfiniteUsers() {
  return useInfiniteQuery({
    /**
     * queryKey: ['users', 'infinite']
     * 用于缓存和失效管理
     */
    queryKey: ['users', 'infinite'],

    /**
     * queryFn: 分页查询函数
     * React Query 自动传递 pageParam
     */
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedUsers(pageParam as number).then((res) => {
        if (!res.success) {
          throw new Error(res.error || '获取用户列表失败')
        }
        return res.data!
      }),

    /**
     * initialPageParam: 初始页码
     * 第一个请求使用的 pageParam 值
     */
    initialPageParam: 1,

    /**
     * getNextPageParam: 下一页参数
     * 返回下一页的 pageParam，如果 hasMore 为 false 则返回 undefined
     */
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  })
}
