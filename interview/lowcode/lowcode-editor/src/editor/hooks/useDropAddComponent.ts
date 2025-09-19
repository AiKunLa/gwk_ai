import { useRef } from "react";
import { useDrop } from "react-dnd";
import { useAcceptTypes } from "./useAcceptTypes";
import { useComponentsStore } from "../store/components";
import { useComponentConfigStore } from "../store/components-config";
import type { AcceptList, DragItem } from "../type/componentType";

/**
 * 通用 Drop 区 Hook：将拖入的物料添加到组件树。
 * - 动态接受所有注册物料类型
 * - 支持 didDrop() 阻止冒泡
 * - 通过 parentId 确定插入到根或某容器下
 *
 * 使用：
 *   const ref = useDropAddComponent(componentId)
 *   return <div ref={ref}>{children}</div>
 *
 * @param parentId 可选，作为新节点的 parentId
 * @returns React.RefObject<HTMLDivElement> 已连接为 Drop 区域的 ref
 */
export const useDropAddComponent = (parentId?: number, acceptsOverride?: AcceptList) => {
  const ref = useRef<HTMLDivElement>(null);
  // 获取所有组件类型
  const accept = useAcceptTypes();
  // 操作json数据
  const { addComponent } = useComponentsStore();
  // 获取注册组件
  const { componentConfig } = useComponentConfigStore();

  const [{canDrop}, drop] = useDrop(() => ({
    // 指定能接收的组件类型
    accept: acceptsOverride && acceptsOverride.length > 0 ? acceptsOverride : (accept as AcceptList),
    drop: (item: DragItem, monitor) => {
      // 阻止冒泡，防止层叠
      if (monitor.didDrop()) return;
      const cfg = componentConfig[item.type];
      if (!cfg) return;
      addComponent({
        id: Date.now(),
        name: item.type,
        props: { ...cfg.defaultProps },
        parentId,
      });
    },
    collect:(monitor) => ({
      canDrop:monitor.canDrop()
    })
  }));

  drop(ref);
  return {ref,canDrop};
};


