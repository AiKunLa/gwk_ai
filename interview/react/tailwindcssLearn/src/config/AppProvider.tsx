
/**
 * AppProvider - 应用全局状态提供组件
 *
 * 作用：
 * - 作为应用顶层组件的包装器
 * - 提供全局状态（如主题、语言、用户信息等）
 * - 管理全局依赖（如 React Query、Router 等）
 *
 * 使用方式：
 * 在 main.tsx 中作为根组件使用，将需要全局状态的组件包裹其中
 *
 * 当前功能：
 * - 简单的 children 透传，可在此扩展添加全局状态管理
 */

interface AppProviderProps {
    children: React.ReactNode
}
export function AppProvider({ children }: AppProviderProps) {
    return (
        <>
            {children}
        </>
    )
}