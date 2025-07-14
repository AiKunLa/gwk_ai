import { useState } from "react";
import Home from "./pages/Home";
import About from "./pages/About";
import UserProfile from "./pages/UserProfile";
import Products from "./pages/Products";
import ProductDetails from "./pages/Products/ProductDetails";
import ProductNew from "./pages/Products/ProductNew";

import {
  BrowserRouter as Router, // 前端路由
  Routes, // 路由设置容器
  Route, // 单条路由
  Link,
} from "react-router-dom";
import "./App.css";

function App() {
  const [id, setId] = useState("123");

  return (
    <>
      {/* 前端路由接管路由 */}
      <Router>
        <nav>
          <Link to="/">首页</Link> <br />
          <Link to="/about">关于</Link> <br />
          <Link to="/user/123">用户</Link> <br />
          <Link to="/products">产品</Link>
        </nav>

        {/* 路由设置容器 */}
        <Routes>
          <Route path="/" element={ <Home />} />
          <Route path="/about" element={<About />} />

          {/* 动态路由 */}
          <Route path="/user/:id" element={<UserProfile id={id} />} />

          <Route path="/products" element={<Products />}>
            {/* 子路由  二级页面 */}
            <Route path=":productId" element={<ProductDetails />} />
            {/* 子路由  二级页面 */}
            <Route path="new" element={<ProductNew />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
