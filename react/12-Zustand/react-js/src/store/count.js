import {
  create, // 创建一个store 存储状态的地方
} from "zustand";

//以use开头 hook，使用（）表示的是返回状态的对象
//  使用 create 函数来创建一个 store。store 是一个包含状态和更新状态的函数的对象。 
export const useCounterStore = create((set) => ({
  // 状态 + 修改状态的方法
  count: 0,
  increment: () => {
    set((state) => ({ // state 是上一个状态对象
      count: state.count + 1,
    }));
  },
  discrement: () => {
    set((state) => ({ count: state.count - 1 }));
  },
}));
