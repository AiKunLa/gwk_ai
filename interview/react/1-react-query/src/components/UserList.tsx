/**
 * UserList 组件
 *
 * 用户列表展示组件，演示 React Query 的无限滚动功能：
 * - useInfiniteQuery 获取分页数据
 * - IntersectionObserver 监听滚动到底部
 * - hasNextPage / fetchNextPage 加载更多
 */

import { useEffect, useRef } from 'react'
import { useInfiniteUsers } from '../hooks/useUsers'
import type { User } from '../types'

/**
 * UserList 组件
 *
 * 功能：
 * 1. 无限滚动加载用户列表
 * 2. 滚动到底部自动加载更多
 * 3. 展示加载状态和错误处理
 */
export function UserList() {
  // 使用 useInfiniteQuery 获取分页数据
  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isFetching,
  } = useInfiniteUsers()

  // 滚动容器引用
  const observerTarget = useRef<HTMLDivElement>(null)

  /**
   * IntersectionObserver 监听滚动到底部
   * 当底部元素进入视口时触发加载更多
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 当底部加载指示器进入视口且可以加载更多时
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: null, // 使用视口作为根
        rootMargin: '100px', // 提前 100px 触发
        threshold: 0.1,
      }
    )

    const target = observerTarget.current
    if (target) {
      observer.observe(target)
    }

    return () => {
      if (target) {
        observer.unobserve(target)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // 扁平化所有页的数据
  const allUsers: User[] = data?.pages.flatMap((page) => page.items) ?? []

  return (
    <div className="demo-card">
      <h3>1. 无限滚动 (useInfiniteQuery)</h3>
      <p>滚动到底部自动加载更多，共 {data?.pages[0]?.total ?? 0} 条数据</p>

      {/* 加载状态（首次加载） */}
      {isLoading && (
        <div className="status-box loading">
          <span className="spinner"></span>
          加载中...
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="status-box error">
          错误: {error.message}
        </div>
      )}

      {/* 用户列表 */}
      {!isLoading && !isError && (
        <>
          <div className="user-list">
            {allUsers.length === 0 ? (
              <div className="empty-state">没有找到用户</div>
            ) : (
              allUsers.map((user: User) => <UserCard key={user.id} user={user} />)
            )}
          </div>

          {/* 底部加载指示器 */}
          <div ref={observerTarget} className="load-more-trigger">
            {isFetchingNextPage && (
              <div className="status-box loading">
                <span className="spinner"></span>
                加载更多...
              </div>
            )}
            {!hasNextPage && allUsers.length > 0 && (
              <div className="no-more-data">已加载全部数据</div>
            )}
          </div>
        </>
      )}

      {/* 查询状态说明 */}
      <div className="query-info">
        <code>isLoading: {isLoading.toString()}</code>
        <code>isFetching: {isFetching.toString()}</code>
        <code>isFetchingNextPage: {isFetchingNextPage.toString()}</code>
        <code>hasNextPage: {hasNextPage?.toString() ?? 'undefined'}</code>
      </div>
    </div>
  )
}

/**
 * UserCard 单用户卡片组件
 */
function UserCard({ user }: { user: User }) {
  const roleColors = {
    admin: '#e94560',
    user: '#0f3460',
    guest: '#533483',
  }

  const statusColors = {
    active: '#00d9ff',
    inactive: '#666',
  }

  return (
    <div className="user-card">
      <div className="user-avatar">
        {user.name.charAt(0)}
      </div>
      <div className="user-info">
        <div className="user-name">{user.name}</div>
        <div className="user-email">{user.email}</div>
        <div className="user-meta">
          <span
            className="user-role"
            style={{ backgroundColor: roleColors[user.role] }}
          >
            {user.role}
          </span>
          <span
            className="user-status"
            style={{ color: statusColors[user.status] }}
          >
            ● {user.status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default UserList
