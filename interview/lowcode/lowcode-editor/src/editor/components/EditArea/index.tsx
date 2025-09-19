import React from "react";
import { useComponentsStore, type Component } from "../../store/components";
import { useComponentConfigStore } from "../../store/components-config";

export default function EditArea() {
  const { components} = useComponentsStore();
  const { componentConfig } = useComponentConfigStore();

  const renderComponents = (components: Component[]): React.ReactNode => {
    return components.map((component: Component) => {
      // 获取对应的组件
      const config = componentConfig?.[component.name];
      if (!config?.component) {
        return null;
      }
      // 渲染组件
      return React.createElement(
        config.component,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        // 子组件
        renderComponents(component.children || [])
      );
    });
  };

  return (
    <>
      {renderComponents(components)}
    </>
  );
}
