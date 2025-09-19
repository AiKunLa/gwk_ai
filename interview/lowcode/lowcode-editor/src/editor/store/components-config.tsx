import { create } from "zustand";
import Container from "../materials/Container";
import Button from "../materials/Button";
import Page from "../materials/Page";
/**
 * 组件配置接口
 * 用于定义一个可复用组件的元信息和默认配置
 * 通常用于组件库、可视化搭建平台或动态渲染场景
 */
export interface ComponentConfig {
  /**
   * 组件的唯一名称或标识符
   * 通常用于在界面中显示组件名、查找组件或作为注册键
   *
   * @example 'Button', 'Input', 'Card', 'CustomHeader'
   */
  name: string;

  /**
   * 组件的默认属性（props）配置
   * 是一个键值对对象，键为属性名，值为默认值
   * 在渲染组件时，这些默认值会被传递给组件
   * Record 是 TypeScript 中的一个内置工具类型（Utility Type），用于快速定义一个对象的结构
   * @example
   * {
   *   size: 'medium',
   *   disabled: false,
   *   label: '提交'
   * }
   */
  defaultProps: Record<string, any>;

  /**
   * 组件的实际实现（组件本身）
   * 可以是 React 函数组件、类组件，或其他框架的组件构造函数/函数
   * 在动态渲染时，此字段会被用来创建组件实例
   *
   * @example
   * component: Button
   * component: (props) => <div {...props} />
   */
  component: any;
}

/**
 * 应用状态接口
 * 描述整个应用（或某个模块）的状态结构
 */
interface State {
  /**
   * 组件配置映射表
   * 以组件的唯一标识符（如名称或ID）为键（key），
   * 以组件的配置对象（ComponentConfig）为值（value），
   * 形成一个键值对集合，便于快速查找和管理组件。
   *
   * 使用场景：
   * - 低代码/可视化搭建平台：存储所有可拖拽组件的元信息
   * - 动态渲染系统：根据配置动态生成组件
   * - 组件库元数据管理
   *
   * @example
   * {
   *   "Button": {
   *     name: "Button",
   *     defaultProps: { type: "primary", size: "middle" },
   *     component: ButtonComponent
   *   },
   *   "Input": {
   *     name: "Input",
   *     defaultProps: { placeholder: "请输入", disabled: false },
   *     component: InputComponent
   *   }
   * }
   */
  componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  // 存储状态
  componentConfig: {
    Container: {
      name: "Container",
      defaultProps: {},
      component: Container,
    },
    Button: {
      name: "Button",
      defaultProps: {
        type: "",
        text: "按钮",
      },
      component: Button,
    },
    Page: {
      name: "Page",
      defaultProps: {
        type: "",
        text: "",
      },
      component: Page,
    },
  },
  // 添加
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));
