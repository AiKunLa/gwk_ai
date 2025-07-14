import { useEffect } from "react";
import { useParams } from "react-router-dom";
export default function UserProfile() {
  const {id} = useParams(); // 返回路由参数对象

  return (
    <>
      <h1>用户详情页</h1>
      <p>用户id: {id}</p>
    </>
  );
}
