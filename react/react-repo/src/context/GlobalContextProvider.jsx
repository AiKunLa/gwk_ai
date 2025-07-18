import { createContext, useReducer } from "react";
import repoReducer from "@/reducers/repoReducer.js";

export const GlobalContext = createContext();

const inititalState = {
  repos: [],
  loading: true,
  error: null,
};

export default function GlobalContextProvider({ children }) {
  const [state, dispatch] = useReducer(repoReducer, inititalState);
  return (
    // 全局上下文，应用上下文 state 是应用状态，dispatch是应用状态的更新函数
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
}
