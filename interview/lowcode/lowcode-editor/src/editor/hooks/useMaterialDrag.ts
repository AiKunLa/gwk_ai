import { useRef } from "react";
import { useDrag } from "react-dnd";
import type { ComponentName, DragItem } from "../type/componentType";

/**
 * 物料项拖拽 Hook。
 * 封装 react-dnd 的 useDrag，返回已连接的 DOM ref。
 *
 * 使用：
 *   const ref = useMaterialDrag('Button')
 *   return <div ref={ref}>Button</div>
 *
 * @param type 拖拽项类型，应与 components-config 中的 key 对齐
 * @returns React.RefObject<HTMLDivElement> 已通过 drag 连接的 ref
 */
export const useMaterialDrag = (type: ComponentName) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drag] = useDrag<DragItem, unknown, unknown>(() => ({ type, item: { type } }));
  drag(ref);
  return ref;
};


