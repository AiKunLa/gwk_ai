import { Button as AntdButton } from "antd";
import type { ButtonType } from "antd/es/Button";
import type { CommonComponentProps } from "../../type/componentType";

// 用于约束传递来的参数
export interface ButtonProps {
  type: ButtonType;
  text: string;
}
/**
 * 按钮组件
 * @param param0 
 * @returns 
 */
export default function Button({ type, text }: ButtonProps & CommonComponentProps) {
  return <AntdButton type={type}>{text}</AntdButton>;
}

export { Button };
