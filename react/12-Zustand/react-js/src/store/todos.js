import {
  create, // 创建一个store 存储状态的地方
} from "zustand";

export const useTodosStore = create((set) => ({
  todos: [
    {
      id: 1,
      text: "学习React",
      completed: false,
    },
    {
      id: 2,
      text: "学习Vue",
      completed: false,
    },
  ],

  // 增加todo
  addTodo: (text) => {
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: state.todos.length + 1,
          text,
          completed: false,
        },
      ],
    }));
  },

  // 删除todo
  removeTodo: (id) => {
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    }));
  },

  // 切换todo
  toggleTodo: (id) => {
    set((state) => ({
      todos: state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
      }),
    }));
  },
}));
