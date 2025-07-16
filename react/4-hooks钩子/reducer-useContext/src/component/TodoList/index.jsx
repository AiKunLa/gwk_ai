import { useState } from "react";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

function TodoList() {
  const [title, setTitle] = useState("ToDoList"); 

  return (
    <div className="continer">
      <h1 className="title">{title}</h1>
      <TodoForm />
      {/* 组件传参 */}
      <TodoItem />
    </div>
  );
}

export default TodoList;
