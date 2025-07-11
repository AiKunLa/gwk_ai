import { useState } from "react";
const TodoForm = ({ onAddTodo }) => {
  // 私有状态
  const [todo, setTodo] = useState({
    title: "",
    isCompleted: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    //
    let result = todo.title.trim();
    if (!result) return;
    onAddTodo({ ...todo, title: result });
    setTodo({
      title: "",
      isCompleted: false,
    });
  };



  return (
    <div className="todo-input">
      <form id="todo-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          id="todo-title"
          value={todo.title}
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          placeholder="请输入内容"
          required
        />
        <button type="submit" >添加</button>
      </form>
    </div>
  );
};
export default TodoForm;
