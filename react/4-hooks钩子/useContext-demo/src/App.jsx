import { useState } from "react";
import Page from "./component/Page";
import "./App.css";
import { ThemeContext } from "./ThemeContext";

function App() {
  const [theme, setTheme] = useState("dark");

  return (
    // 1. 用ThemeContext.Provider包裹住App组件的所有内容, 为内部的组件提供服务。
    <ThemeContext.Provider value={theme}>
      <button onClick={()=> setTheme("light")}>切换为浅色</button>
      <Page></Page>
      {/* <Uncle></Uncle> */}
    </ThemeContext.Provider>
  );
}

export default App;
