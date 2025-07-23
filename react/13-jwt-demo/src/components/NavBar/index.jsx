import { Link } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import styles from "./index.module.css";

export default function NavBar() {
  const { isLogin, logout } = useUserStore();

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.navLink}>
        首页
      </Link>
      <Link to="/user" className={styles.navLink}>
        用户中心
      </Link>
      {isLogin ? (
        <button onClick={logout} className={styles.logoutButton}>
          退出
        </button>
      ) : (
        <>
          <Link to="/register" className={styles.navLink}>
            注册
          </Link>
          <Link to="/login" className={styles.navLink}>
            登录
          </Link>
        </>
      )}
    </nav>
  );
}
