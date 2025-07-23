import { useState, useRef, forwardRef } from "react";
import "./App.css";
import { useEffect } from "react";

function Gong(props, ref) {
  console.log(ref)
  return <input type="text" ref={ref} />;
}

// 高级组件，返回一个全新的组件，这个组件具备向下传递ref的能力
// react 默认不能传递ref
const WapperGong = forwardRef(Gong);

function Kong(props) {
  console.log("不使用forwardRef", props);
  return (
    <>
      <input type="text" ref={props.ref}/>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef2.current?.focus();
  }, []);
  return (
    <>
      {/* <Kong ref={inputRef} /> Kong */}
      <WapperGong ref={inputRef2} /> WapperGong
    </>
  );
}

export default App;
