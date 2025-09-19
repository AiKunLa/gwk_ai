import type { CommonComponentProps } from "../../type/componentType";
import { useDropAddComponent } from "../../hooks/useDropAddComponent";

/**
 * 物料区域中的容器
 * @param param0
 * @returns
 */
export default function Container(props: CommonComponentProps) {
  const { children, id } = props;
  const { ref } = useDropAddComponent(id, ["Button", "Container"]); // 容器可接收自身/按钮
  return (
    <div
      ref={ref}
      className="border-[1px] border-[#000] min-h-[100px] p-[20px]"
    >
      {children}
    </div>
  );
}
