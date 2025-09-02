import { useState } from "react";
import "./App.css";
import VirtualList from "./components/VirtualList";

const generateDate = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    description: `This is number ${i}, rendered with virtual with virtual scrolling`,
  }));
};

function App() {
  const data = generateDate(10000);
  // Item 组件
  const renderItem = (item, index) => (
    <div
      style={{
        padding: "10px",
        borderBottom: "1px solid #eee",
        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
      }}
    >
      <strong>[{index}]</strong> {item.name}
      <p
        style={{
          margin: "4px 0",
          fontSize: "0.9em",
          color: "#666",
        }}
      >
        {item.description}
      </p>
    </div>
  );

  return (
    <>
      <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h1>Virtual List With 10000</h1>
        <p>Smooth scrplling</p>
        {/* 固定高度的虚拟列表 */}
        <VirtualList
          data={data}
          // 列表高度
          height={window.innerHeight - 100}
          // 每一项的高度
          itemHeight={80}
          renderItem={renderItem}
          // 提前渲染几个
          overscan={3} 
        />
      </div>
    </>
  );
}

export default App;
