import type { PropsWithChildren } from "react";

// 可声明为已知物料名的联合类型，也保留扩展空间
export type ComponentName =
  | "Page"
  | "Container"
  | "Button"
  | (string & {});

export interface CommonComponentProps extends PropsWithChildren {
    id: number
    name: ComponentName
    className?: string
    style?: React.CSSProperties
    [key: string]: any
}

// DnD 拖拽项类型
export interface DragItem { type: ComponentName }

// Drop 可接受的类型列表
export type AcceptList = ComponentName[];

// 组件树节点（可选：供 store/渲染层复用）
export interface ComponentNode {
  id: number
  name: ComponentName
  props: Record<string, any>
  desc?: string
  children?: ComponentNode[]
  parentId?: number
}