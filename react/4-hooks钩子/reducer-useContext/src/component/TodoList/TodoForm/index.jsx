import { useState } from "react";
import { useTodoContext } from "../../../hoosk/useTodoContext";
function TodoForm() {
  const [container, setContainer] = useState("");
  const { addList } = useTodoContext();

  function handleSubmit(e) {
    e.preventDefault();
    if (container.trim()) {
      addList(container.trim());
    }
    setContainer("");
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="请输入待办事项"
        value={container}
        onChange={(e) => {
          setContainer(e.target.value);
        }}
      />
      <button type="submit">添加</button>
    </form>
  );
}

export default TodoForm;
