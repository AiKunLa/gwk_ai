/**
 * UserForm 组件
 *
 * 用户表单组件，演示 React Query 的突变操作：
 * - useMutation 执行创建/更新/删除
 * - 乐观更新 (optimistic update)
 * - 错误回滚
 * - 自动缓存失效 (invalidateQueries)
 */

import { useState } from 'react'
import { useCreateUser, useUpdateUser, useDeleteUser } from '../hooks/useUsers'
import type { CreateUserInput, User } from '../types'

/**
 * 模式类型：创建、更新、删除
 */
type FormMode = 'create' | 'update' | 'delete'

/**
 * UserForm 组件
 *
 * 功能：
 * 1. 创建新用户
 * 2. 更新现有用户
 * 3. 删除用户
 * 4. 展示乐观更新效果
 */
export function UserForm() {
  // 当前模式
  const [mode, setMode] = useState<FormMode>('create')

  // 目标用户（用于更新/删除）
  const [targetUser, setTargetUser] = useState<User | null>(null)

  // 乐观更新状态展示
  const [optimisticUpdate, setOptimisticUpdate] = useState<string | null>(null)

  // 创建用户表单状态
  const [createForm, setCreateForm] = useState<CreateUserInput>({
    name: '',
    email: '',
    role: 'user',
  })

  // 更新表单状态
  const [updateForm, setUpdateForm] = useState<Partial<CreateUserInput>>({
    name: '',
    email: '',
    role: undefined,
  })

  /**
   * useCreateUser hook - 创建用户
   * 包含乐观更新逻辑
   */
  const createMutation = useCreateUser()

  /**
   * useUpdateUser hook - 更新用户
   */
  const updateMutation = useUpdateUser()

  /**
   * useDeleteUser hook - 删除用户
   */
  const deleteMutation = useDeleteUser()

  /**
   * 处理创建用户
   */
  const handleCreate = () => {
    if (!createForm.name || !createForm.email) {
      alert('请填写名称和邮箱')
      return
    }

    setOptimisticUpdate(`[乐观更新] 即将创建用户: ${createForm.name}`)
    createMutation.mutate(createForm, {
      onSuccess: (data) => {
        setOptimisticUpdate(`创建成功! ID: ${data.id}`)
        setCreateForm({ name: '', email: '', role: 'user' })
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
      onError: (err) => {
        setOptimisticUpdate(`创建失败: ${err.message}`)
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
    })
  }

  /**
   * 处理更新用户
   */
  const handleUpdate = () => {
    if (!targetUser) {
      alert('请先选择要更新的用户')
      return
    }

    const input: { id: number; input: typeof updateForm } = {
      id: targetUser.id,
      input: updateForm,
    }

    setOptimisticUpdate(`[乐观更新] 即将更新用户: ${targetUser.name}`)
    updateMutation.mutate(input, {
      onSuccess: () => {
        setOptimisticUpdate(`更新成功!`)
        setUpdateForm({ name: '', email: '', role: undefined })
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
      onError: (err) => {
        setOptimisticUpdate(`更新失败: ${err.message}`)
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
    })
  }

  /**
   * 处理删除用户
   */
  const handleDelete = () => {
    if (!targetUser) {
      alert('请先选择要删除的用户')
      return
    }

    setOptimisticUpdate(`[乐观更新] 即将删除用户: ${targetUser.name}`)
    deleteMutation.mutate(targetUser.id, {
      onSuccess: () => {
        setOptimisticUpdate(`删除成功!`)
        setTargetUser(null)
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
      onError: (err) => {
        setOptimisticUpdate(`删除失败: ${err.message}`)
        setTimeout(() => setOptimisticUpdate(null), 3000)
      },
    })
  }

  /**
   * 选择预定义用户进行更新/删除
   */
  const selectUser = (user: User) => {
    setTargetUser(user)
    setUpdateForm({ name: user.name, email: user.email, role: user.role })
  }

  const isMutating = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return (
    <div className="demo-card">
      <h3>3. 突变操作 (useMutation + 乐观更新)</h3>
      <p>创建/更新/删除用户，展示乐观更新效果</p>

      {/* 模式切换 */}
      <div className="mode-tabs">
        <button
          className={mode === 'create' ? 'active' : ''}
          onClick={() => setMode('create')}
        >
          创建用户
        </button>
        <button
          className={mode === 'update' ? 'active' : ''}
          onClick={() => setMode('update')}
        >
          更新用户
        </button>
        <button
          className={mode === 'delete' ? 'active' : ''}
          onClick={() => setMode('delete')}
        >
          删除用户
        </button>
      </div>

      {/* 乐观更新状态 */}
      {optimisticUpdate && (
        <div className="status-box optimistic">
          <span className="spinner"></span>
          {optimisticUpdate}
        </div>
      )}

      {/* 创建表单 */}
      {mode === 'create' && (
        <div className="form-section">
          <div className="form-group">
            <label>名称:</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="输入用户名称"
              disabled={isMutating}
            />
          </div>
          <div className="form-group">
            <label>邮箱:</label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              placeholder="输入邮箱地址"
              disabled={isMutating}
            />
          </div>
          <div className="form-group">
            <label>角色:</label>
            <select
              value={createForm.role}
              onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as CreateUserInput['role'] })}
              disabled={isMutating}
            >
              <option value="admin">管理员</option>
              <option value="user">普通用户</option>
              <option value="guest">访客</option>
            </select>
          </div>
          <button
            className="submit-btn create"
            onClick={handleCreate}
            disabled={isMutating}
          >
            {createMutation.isPending ? '创建中...' : '创建用户'}
          </button>
        </div>
      )}

      {/* 更新表单 */}
      {mode === 'update' && (
        <div className="form-section">
          <div className="form-group">
            <label>选择用户:</label>
            <select
              value={targetUser?.id ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value)
                if (id) selectUser({ id, name: '', email: '', role: 'user', status: 'active', createdAt: '' } as User)
              }}
              disabled={isMutating}
            >
              <option value="">-- 选择用户 --</option>
              <option value="1">张三</option>
              <option value="2">李四</option>
              <option value="3">王五</option>
              <option value="4">赵六</option>
            </select>
          </div>
          <div className="form-group">
            <label>新名称:</label>
            <input
              type="text"
              value={updateForm.name ?? ''}
              onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
              placeholder="输入新名称（可选）"
              disabled={isMutating}
            />
          </div>
          <div className="form-group">
            <label>新邮箱:</label>
            <input
              type="email"
              value={updateForm.email ?? ''}
              onChange={(e) => setUpdateForm({ ...updateForm, email: e.target.value })}
              placeholder="输入新邮箱（可选）"
              disabled={isMutating}
            />
          </div>
          <button
            className="submit-btn update"
            onClick={handleUpdate}
            disabled={isMutating || !targetUser}
          >
            {updateMutation.isPending ? '更新中...' : '更新用户'}
          </button>
        </div>
      )}

      {/* 删除确认 */}
      {mode === 'delete' && (
        <div className="form-section">
          <div className="form-group">
            <label>选择用户:</label>
            <select
              value={targetUser?.id ?? ''}
              onChange={(e) => {
                const id = Number(e.target.value)
                if (id) selectUser({ id, name: '', email: '', role: 'user', status: 'active', createdAt: '' } as User)
              }}
              disabled={isMutating}
            >
              <option value="">-- 选择用户 --</option>
              <option value="1">张三</option>
              <option value="2">李四</option>
              <option value="3">王五</option>
              <option value="4">赵六</option>
            </select>
          </div>
          {targetUser && (
            <div className="delete-warning">
              确认删除用户 <strong>{targetUser.name}</strong>？此操作不可撤销。
            </div>
          )}
          <button
            className="submit-btn delete"
            onClick={handleDelete}
            disabled={isMutating || !targetUser}
          >
            {deleteMutation.isPending ? '删除中...' : '删除用户'}
          </button>
        </div>
      )}

      {/* Mutation 状态 */}
      <div className="query-info">
        <code>isPending: {isMutating.toString()}</code>
        <code>isError: {(createMutation.isError || updateMutation.isError || deleteMutation.isError).toString()}</code>
      </div>
    </div>
  )
}

export default UserForm
