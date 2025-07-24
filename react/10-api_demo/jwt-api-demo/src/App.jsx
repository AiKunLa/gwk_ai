import { useState, useEffect } from "react";
import "./App.css";
import { login, getTodos } from "./api";

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodos();
      console.log(data);
      setTodos(data.data.data);
    };
    fetchData();
  }, []);


  return (
    <>
      <h2>todos列表</h2>
      <ul>
        {todos.map((item) => (
          <li key={item.id}>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
      
    </>
  );
}

export default App;
