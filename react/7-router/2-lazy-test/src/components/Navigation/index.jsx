import { Link } from "react-router-dom";
import "./index.css";

export default function Navigation() {
  return (
    <nav className="nav-container">
      <Link to="/" className="nav-link">
        首页
      </Link>
      <Link to="/about" className="nav-link">
        关于
      </Link>
      <Link to="/pay" className="nav-link">
        支付
      </Link>
      <Link to="/login" className="nav-link">
        登录
      </Link>
    </nav>
  );
}
