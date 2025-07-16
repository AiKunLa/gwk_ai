import { useReducer, useState } from "react";

import "./App.css";

const initialState = {
  count: 0,
  isLogin: false,
  theme: "light",
};

//
const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case 'INCREMENTBYNUM':
      return {...state,count:state.count+parseInt(action.payload)}
    case "LOGIN":
      return { ...state, isLogin: true };
    case "LOGOUT":
      return { ...state, isLogin: false };
    case "CHANGE_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

function App() {
  // 初始状态 initialState
  // 当前状态 旧状态 新状态
  // 界面由当前状态来驱动
  // 修改状态的方法
  // 响应式
  const [count, setCount] = useState(0);

  // 适用于大型项目
  // initialState 可以是一个复杂的数据对象，
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <h1>{state.count}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+1</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-1</button>
      <input
        type="text"
        value={count}
        onChange={(e) => setCount(e.target.value)}
      />
      <button
        onClick={() => dispatch({ type: "INCREMENTBYNUM", payload: count })}
      >
        增加数量
      </button>
    </>
  );
}

export default App;
