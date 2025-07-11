import { useState ,useEffect} from "react";

export const useTodos = () => {
  // 这里会阻塞，
  const [todos, setTodos] = useState(
    JSON.parse(localStorage.getItem("todos")) || []
  );

  // 存入
  useEffect(() => {
    // 将对象序列号成字符串
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // 添加数据
  const onAddTodo = (todo) => {
    // 若为对象，则将原来的扔掉
    setTodos([
      ...todos,
      {
        id: Date.now(),
        ...todo,
      },
    ]);
    console.log(todos);
  };

  // 修改数据
  const onChangeTodo = (id) => [
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    ),
  ];

  const onTodoDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    onAddTodo,
    onChangeTodo,
    onTodoDelete,
  };
};
