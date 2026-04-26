/**
 * UserDetail 组件
 *
 * 用户详情组件，演示 React Query 的带参数查询：
 * - useQuery 获取单个用户
 * - enabled 控制查询是否执行
 */

import { useState } from 'react'
import { useUser } from '../hooks/useUsers'

/**
 * UserDetail 组件
 *
 * 功能：
 * 1. 根据输入的 ID 获取用户详情
 * 2. 展示查询状态（加载、错误、空状态）
 */
export function UserDetail() {
  // 用户 ID 输入状态
  const [userId, setUserId] = useState<number | undefined>(1)

  /**
   * useUser hook
   * - enabled: id !== undefined 时才执行查询
   * - 当 userId 变化时自动重新获取
   */
  const { data: user, isLoading, isError, error, refetch, isFetching } = useUser(userId)

  return (
    <div className="demo-card">
      <h3>2. 带参数查询 (queryKey + enabled)</h3>
      <p>根据用户 ID 获取详情，ID 变化时重新查询</p>

      {/* ID 输入 */}
      <div className="input-group">
        <label>用户 ID:</label>
        <input
          type="number"
          value={userId ?? ''}
          onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : undefined)}
          min="1"
          className="id-input"
        />
        <button onClick={() => refetch()} disabled={isFetching}>
          刷新
        </button>
      </div>

      {/* ID 快捷按钮 */}
      <div className="quick-ids">
        <span>快速查看:</span>
        {[1, 2, 3, 4].map((id) => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            className={userId === id ? 'active' : ''}
          >
            {id}
          </button>
        ))}
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="status-box loading">
          <span className="spinner"></span>
          加载用户详情...
        </div>
      )}

      {/* 错误状态 */}
      {isError && (
        <div className="status-box error">
          错误: {error.message}
        </div>
      )}

      {/* 用户详情 */}
      {!isLoading && !isError && user && (
        <div className="user-detail">
          <div className="detail-header">
            <div className="detail-avatar">{user.name.charAt(0)}</div>
            <div>
              <div className="detail-name">{user.name}</div>
              <div className="detail-email">{user.email}</div>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">ID</span>
              <span className="detail-value">{user.id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">角色</span>
              <span className="detail-value role-badge">{user.role}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">状态</span>
              <span className="detail-value">{user.status}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">创建时间</span>
              <span className="detail-value">
                {new Date(user.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 查询状态说明 */}
      <div className="query-info">
        <code>isLoading: {isLoading.toString()}</code>
        <code>isFetching: {isFetching.toString()}</code>
        <code>isStale: 数据是否过期</code>
      </div>
    </div>
  )
}

export default UserDetail
