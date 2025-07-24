import { Outlet } from "react-router-dom";

export default function BlankLayout() {
  return (
    <div>
      <Outlet />
      <h1>BlankLayout</h1>
    </div>
  );
}
export { BlankLayout };
