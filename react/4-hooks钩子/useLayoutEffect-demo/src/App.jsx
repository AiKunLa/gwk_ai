import { useState, useLayoutEffect, useRef, useEffect } from "react";

import "./App.css";

// function App() {

//   // 响应式对象
//   const boxRef = useRef();
//   // console.log(boxRef.current,boxRef)

//   // useEffect(()=>{
//   //   console.log("useEffect",boxRef.current.offsetHeight)
//   // },[])

//   // useLayoutEffect(()=>{
//   //   console.log("useLayoutEffect",boxRef.current.offsetHeight)
//   // },[])

//   // useEffect(() => {
//   //   boxRef.current.style.height = "200px";

//   // }, []);

//   useLayoutEffect(()=>{
//     boxRef.current.style.height = "200px";
//   },[])

//   return (
//     <>
//       <div
//         ref={boxRef}
//         style={{ height: "100px", backgroundColor: "lightblue" }}
//       >
//         我是div
//       </div>
//     </>
//   );
// }

function App() {

  return (
    <>
      <Modal />
      {/* <div
        ref={boxRef}
        style={{ height: "100px", backgroundColor: "lightblue" }}
      >
        我是div
      </div> */}
    </>
  );
}
// 弹窗
function Modal() {
  // 响应式对象
  const modalRef = useRef();
  // useLayoutEffect(() => {
  //   const height = modalRef.current.offsetHeight
  //   modalRef.current.style.marginTop = `${(window.innerHeight - height) / 2}px`
  // },[]);

  useEffect(()=>{
    const height = modalRef.current.offsetHeight
    modalRef.current.style.backgroundColor = "lightblue"
    // modalRef.current.style.marginTop = `${(window.innerHeight - height) / 2}px`
    modalRef.current.style.height = "100px"
  },[window.innerHeight])

  return (
    <>
      <div
        ref={modalRef}
        style={{ position: "absolute", width: "200px",height: "200px", backgroundColor: "red" }}
      >
        我是小明
      </div>
    </>
  );
}

export default App;
