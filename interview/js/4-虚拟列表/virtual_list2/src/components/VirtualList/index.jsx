import { useRef } from "react";

export default function VirtualList({
  data,
  height,
  itemHeight,
  renderItem,
  overscan,
}) {
  // 10万条数据的总高度
  const totalHeight = data.length * itemHeight;
  const containerRef = useRef(null);
  const onScroll = () => {};
  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      style={{
        height,
        overflowY: "auto",
        position: "relative",
        // 性能优化点 新的图层
        willChange: "transform",
      }}
    >
      <div style={{ height: totalHeight, position: "relative" }}></div>
      {/* <div
        style={{
          posiiton: "absolute",
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${offset}px)`,
        }}
      ></div> */}
    </div>
  );
}
