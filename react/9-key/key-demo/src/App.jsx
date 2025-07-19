import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const objArr = [
    { id: 0, name: "张三" },
    { id: 1, name: "李四" },
    { id: 2, name: "王五" },
    { id: 3, name: "赵四" },
  ];

  const [to, setTo] = useState(objArr);

  useEffect(() => {
    // 5秒后
    setTimeout(() => {
      // setTo((pre) =>
      //   pre.map((item) => {
      //     if (item.id === 0) {
      //       return { ...item, name: "赵六" };
      //     }
      //     return item;
      //   })
      // );
      setTo((pre) => [{ id: 4, name: "赵六" }, ...pre]);
      // 在root节点第一个中添加一个新的li元素
      
    }, 5000);
  }, []);

  return (
    <>
      <ul id="root">
        {/* jsx 会自动展开数组中的React元素 */}
        {to.map((item, index) => {
          return <li key={index}>{item.name}</li>;
        })}
      </ul>
    </>
  );
}

export default App;
