import { useState } from "react";
import Page from "./component/Page";
import "./App.css";
import { ThemeContext } from "./ThemeContext";
import { useContext } from "react";
function App() {
  const themeContext = useContext(ThemeContext);
  
  const [theme, setTheme] = useState(themeContext.theme);
  return (
    // 1. 用ThemeContext.Provider包裹住App组件的所有内容, 为内部的组件提供服务。
    <div className="container">
      <ThemeContext.Provider value={theme}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          切换为{theme === "dark" ? "浅色" : "深色"}
        </button>
        <Page></Page>
      </ThemeContext.Provider>
    </div>
  );
}

export default App;
