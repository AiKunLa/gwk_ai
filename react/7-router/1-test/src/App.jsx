import { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="container">
        <Router>
          <nav>
            {/* a标签 */}
            <ul>
              <li>
                <a href="/">首页</a>
              </li>
              <li>
                <a href="/about">关于</a>
              </li>
            </ul>
            <Link to="/">首页</Link> <br />
            <Link to="/about">关于</Link> <br />
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
