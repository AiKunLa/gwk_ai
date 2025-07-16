import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return [
        ...state,
        { id: Date.now(), container: action.payload.container, completed: false },
      ];
    case "remove":
      return state.filter((item) => item.id !== action.payload.id);
    case "changeCompleted":
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return { ...item, completed: !item.completed };
        }
        return item;
      });
    default:
      return state;
  }
}

export function useTodos(inital = []) {
  // 提供参数默认值
  // value 是一个数组对象
  const [todos, dispatch] = useReducer(reducer, inital);

  const addList = (container) => {
    dispatch({
      type: "add",
      payload: {
        container,
      },
    });
  };

  const deleteList = (id) => {
    dispatch({
      type: "remove",
      payload: {
        id,
      },
    });
  };

  const changeCompleted = (id) => {
    dispatch({
      type: "changeCompleted",
      payload: {
        id,
      },
    });
  };
  return {
    todos,
    addList,
    deleteList,
    changeCompleted,
  };
}
