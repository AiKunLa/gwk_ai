"use client";
import { useEffect, useState } from "react";
import ReactFlow, { Background, Node, Edge, Controls } from "reactflow";
import "reactflow/dist/style.css";
// 客户端不直接使用 supabase-js + dotenv，改为调用服务端 API

export default function FlowEditor() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  // 当前选中的节点id
  const [nodeId, setNodeId] = useState<number>(0);

  const addNode = () => {
    const newNode = {
      id: nodes.length + 1 + "",
      position: { x: 100 + 150 * nodes.length, y: 100 },
      data: { label: "新节点" },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
    setEdges((edges) => [
      ...edges,
      {
        id: `e${newNode.id}-${newNode.id}`,
        source: nodes[nodes.length - 1].id,
        target: newNode.id,
      },
    ]);
  };
  const removeNode = () => {
    if (nodes.length <= 1) return;
    const lastNode = nodes[nodes.length - 1];
    // 删除节点
    setNodes((preNodes) => preNodes.slice(0, -1));
    // 删除边
    setEdges((edgs) =>
      edgs.filter((e) => e.source !== lastNode.id && e.target !== lastNode.id)
    );

    setNodeId(id => id - 1)

  };

  const saveToSupabase = async () => {
    const res = await fetch("/api/flows", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "demo flow", nodes, edges }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      alert("保存失败：" + (data?.error || "Unknown error"));
    } else {
      alert("保存成功");
    }
  };
  /**
   *
   * @param _ 事件
   * @param node
   */
  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    console.log(node);
    const newLabel = prompt("请输入新标签", node.data.label as string);
    if (newLabel !== null && newLabel.trim() !== "") {
      setNodes((nodes) =>
        nodes.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    }
  };

  // 挂载时加载最新一次保存的数据
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/flows");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data?.nodes) && Array.isArray(data?.edges)) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      } catch {}
    })();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={addNode}>添加节点</button>
        <button onClick={removeNode}>移除节点</button>
        <button onClick={saveToSupabase}>保存到supabase</button>
      </div>
      <ReactFlow nodes={nodes} edges={edges} onNodeClick={handleNodeClick}>
        {/* 背景 */}
        <Background />
        {/* 控制按钮 */}
        <Controls />
      </ReactFlow>
    </div>
  );
}
