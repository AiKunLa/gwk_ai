import { useMemo } from "react";
import { useComponentConfigStore } from "../../store/components-config";
import  MaterialItem  from "../MaterialItem";

export default function Material() {
  const { componentConfig } = useComponentConfigStore();

  // 获取componentConfig的所有值
  const components = useMemo(() => {
    return Object.values(componentConfig);
  }, [componentConfig]);

  return (
    <div>
      {components.map((item) => {
        return <MaterialItem name={item.name} key={item.name}/>;
      })}
    </div>
  );
}
