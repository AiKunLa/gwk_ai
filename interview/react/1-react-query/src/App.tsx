/**
 * React Query Demo App
 *
 * 本应用演示 React Query (@tanstack/react-query) 的核心功能：
 *
 * 1. 基础查询 (useQuery) - 获取用户列表
 * 2. 带参数查询 - 根据 ID 获取用户详情
 * 3. 突变操作 (useMutation) - 创建/更新/删除用户
 * 4. 乐观更新 - 即时 UI 反馈
 * 5. 缓存管理 - 自动缓存和失效
 */

import { QueryProvider } from './components/QueryProvider'
import { UserList } from './components/UserList'
import { UserDetail } from './components/UserDetail'
import { UserForm } from './components/UserForm'
import './App.css'

/**
 * App 主组件
 *
 * 使用 QueryProvider 包裹应用，
 * 提供 React Query 的查询客户端上下文
 */
function App() {
  return (
    <QueryProvider>
      <div className="app">
        <header className="app-header">
          <h1>React Query Demo</h1>
          <p>使用 Mock API 模拟后端数据响应</p>
        </header>

        <main className="app-main">
          <UserList />
          <UserDetail />
          <UserForm />

          {/* 功能说明 */}
          <section className="demo-card features">
            <h3>React Query 核心概念</h3>
            <div className="feature-grid">
              <div className="feature-item">
                <h4>useQuery</h4>
                <p>用于数据获取，自动处理加载/错误状态，支持缓存和后台刷新</p>
              </div>
              <div className="feature-item">
                <h4>useMutation</h4>
                <p>用于数据变更（增删改），支持乐观更新和自动失效</p>
              </div>
              <div className="feature-item">
                <h4>Query Key</h4>
                <p>查询的唯一标识，用于缓存管理和手动失效</p>
              </div>
              <div className="feature-item">
                <h4>Optimistic Update</h4>
                <p>在请求完成前立即更新 UI，提供即时反馈体验</p>
              </div>
              <div className="feature-item">
                <h4>Cache Invalidation</h4>
                <p>数据变更后自动失效相关缓存，触发重新获取</p>
              </div>
              <div className="feature-item">
                <h4>Stale-While-Revalidate</h4>
                <p>先显示缓存数据，同时在后台验证数据是否过期</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </QueryProvider>
  )
}

export default App
