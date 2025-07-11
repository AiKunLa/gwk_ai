import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { useTodos } from '@/hooks/useTodos';
const Todos = () => {
  const { todos, onAddTodo, onChangeTodo, onTodoDelete } = useTodos();
  return (
    <div className="app">
      <TodoForm onAddTodo={onAddTodo} onChangeTodo={onChangeTodo} />
      <TodoList
        todos={todos}
        onChangeTodo={onChangeTodo}
        onTodoDelete={onTodoDelete}
      />
    </div>
  );
};
export default Todos;
