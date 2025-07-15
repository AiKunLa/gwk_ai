import { Navigate, useLocation } from "react-router-dom";

export default function ProtectRoute(props) {
  // 这里的Pay并非是子组件，它表示的是props的children属性
  console.log(props);

  const {pathname} = useLocation();
  console.log(pathname);

  const { children } = props;
  console.log(children);
  const isLogin = localStorage.getItem("isLogin") === "true";
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: pathname }} />;
  }
  return (
    <div>
      <h1>ProtectRoute</h1>
      {children}
    </div>
  );
}
