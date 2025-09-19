import type { CommonComponentProps } from "../../type/componentType";
import { useDropAddComponent } from "../../hooks/useDropAddComponent";

export default function Page(props: CommonComponentProps) {
  const { children, id } = props;
  const { ref } = useDropAddComponent(id, ["Container", "Button"]); // Page 仅接收这些
  return (
    <div ref={ref} className="p-[20px] h-[100%] box-border">
      {children}
    </div>
  );
}
