import { useContext } from "react";
import { TodoContext } from "../TodoContext";
// 自定义 hook 返回上下文
export function useTodoContext() {
  return useContext(TodoContext);
}
