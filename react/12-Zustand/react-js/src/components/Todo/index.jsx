import { useTodosStore } from "@/store/todos";
const Todo = () => {
  const { todos, removeTodo, toggleTodo, addTodo } = useTodosStore();

  return (
    <>
      <ul>
        {todos.map((item) => {
          return (
            <li key={item.id}>
              <span style={{textDecoration:item.completed?'line-through':''}}>{item.text}</span>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTodo(item.id)}
              ></input>
              <button onClick={() => removeTodo(item.id)}>删除</button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
export default Todo;
