import { useComponentConfigStore } from "../store/components-config";

/**
 * 获取可被 Drop 接受的拖拽类型列表。
 * 来源于组件注册表（components-config），
 * 用于统一维护 dnd 的 accept 类型，避免硬编码。
 *
 * @returns string[] 所有已注册组件的名称数组
 */
export const useAcceptTypes = () => {
  const { componentConfig } = useComponentConfigStore();
  return Object.keys(componentConfig);
};


