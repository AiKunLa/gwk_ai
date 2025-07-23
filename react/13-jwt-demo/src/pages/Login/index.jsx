import { useState } from "react";
import Style from "./index.module.css";
// import request from '@/utils/request';
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

export default function Login() {
  const { login, error, loading, isLogin, setError } = useUserStore();

  // 表单数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // 简单验证
    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }
    await login({ username, password });
    console.log("---------------");
    console.log(isLogin);
    if (isLogin) {
      console.log("nav");
      navigate("/");
    }
  };

  return (
    <div className={Style.loginContainer}>
      <div className={Style.loginBox}>
        <h1 className={Style.title}>用户登录</h1>
        <form onSubmit={handleSubmit} className={Style.form}>
          {error && <div className={Style.error}>{error}</div>}

          <div className={Style.inputGroup}>
            <label htmlFor="username" className={Style.label}>
              用户名
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={Style.input}
              placeholder="请输入用户名"
              disabled={loading}
            />
          </div>

          <div className={Style.inputGroup}>
            <label htmlFor="password" className={Style.label}>
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={Style.input}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>

          <button type="submit" className={Style.btn} disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}
