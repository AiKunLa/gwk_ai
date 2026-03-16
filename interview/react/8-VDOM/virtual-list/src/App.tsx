import { VirtualList } from './components/VitrualList'

// 生成 10000 条测试数据
const data = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`,
}))

function App() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Virtual List Demo</h1>
      <p>Total items: {data.length}</p>
      <VirtualList
        data={data}
        // 设置容器高度和每行高度
        height={400}
        itemHeight={50}
        // 这里的 renderItem 负责渲染每一行的内容
        renderItem={(item) => (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              borderBottom: '1px solid #eee',
              background: item.id % 2 === 0 ? '#fff' : '#f9f9f9',
            }}
          >
            {item.name}
          </div>
        )}
      />
    </div>
  )
}

export default App
