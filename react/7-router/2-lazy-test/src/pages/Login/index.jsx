import { useState } from "react";
import { useNavigate ,useLocation} from "react-router-dom";

console.log('加载Login组件')
export default function Login() {
  console.log('Login')
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "" || password === "") {
      alert("请输入用户名和密码");
      return;
    }
    localStorage.setItem("isLogin", true);
   
    navigate(location?.state?.from || "/");
  };

  return (
    <div>
      <h1>登录</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">登录</button>
      </form>
    </div>
  );
}
