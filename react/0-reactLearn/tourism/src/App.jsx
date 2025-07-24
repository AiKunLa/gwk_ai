import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div
        style={{ width: "2.6666rem", height: "5rem", background: "red" }}
      ></div>
      <div id="box"></div>
    </>
  );
}

export default App;
