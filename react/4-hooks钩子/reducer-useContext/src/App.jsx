import "./App.css";
import { TodoContext } from "./TodoContext";
import { useTodos } from "./hoosk/useTodos";
import TodoList from "./component/TodoList";

function App() {
  const todosHook = useTodos([{id: 1,container: "吃饭",completed: false,},{id: 2,container: "睡觉",completed: true,},]);
  return (
    <>
      <TodoContext.Provider value={todosHook}>
        <TodoList />
      </TodoContext.Provider>
    </>
  );
}

export default App;
