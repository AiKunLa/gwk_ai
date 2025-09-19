import { create } from "zustand";

// parentId + children 可以组成一个树结构
export interface Component {
  id: number;
  name: string;
  props: any;
  desc?: string;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
}

interface Actions {
  addComponent: (component: Component, parentId?: number) => void;
  removeComponent: (component: Component) => void;
  updateComponent: (id: number, props: any) => void;
}

// 更新组件状态 store中只有state和actions 使用State和Actions来定义状态和操作
// & 这里是ts的交叉类型，表示可以是State也可以是Actions
export const useComponentsStore = create<State & Actions>((set) => ({
  components: [
    {
      id: 22,
      name: "Page",
      props: {},
    },
  ],
  addComponent: (component: Component) =>
    set((state) => {
      if (component.parentId) {
        const parent = getComponentById(state.components, component.parentId);
        // 如果父组件存在，则将子组件添加到父组件的children中
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(component);
        }
        return {
          components: [...state.components],
        };
      } else {
        // 如果父组件不存在，则将子组件添加到组件列表中
        component.parentId = undefined;
        return {
          components: [...state.components, component],
        };
      }
    }),
  removeComponent: (component: Component) =>
    set((state) => {
      // 获取父组件
      if (component.parentId) {
        const parent = getComponentById(state.components, component.parentId);
        if (parent) {
          parent.children = parent.children?.filter(
            (child) => child.id !== component.id
          );
        }
        return {
          components: [...state.components],
        };
      } else {
        // 是第一层
        return {
          components: state.components.filter(
            (child) => child.id !== component.id
          ),
        };
      }
    }),
  updateComponent: (id, props) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, ...props } : component
      ),
    }));
  },
}));

/**
 * 根据id获取组件 递归获取
 * @param components 组件列表
 * @param id
 * @returns
 */
export const getComponentById = (
  components: Component[],
  id: number
): Component | null => {
  // 递归获取组件
  for (const component of components) {
    if (component.id === id) {
      return component;
    }
    if (component.children && component.children.length > 0) {
      const result = getComponentById(component.children, id);
      if (result) {
        return result;
      }
    }
  }
  return null;
};
