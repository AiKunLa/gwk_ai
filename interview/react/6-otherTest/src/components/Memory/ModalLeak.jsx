import { useState, useEffect, useRef } from 'react'

// 危险：模块级回调数组，存储带有闭包引用的回调
const pendingCallbacks = []
// 存储弹窗数据引用
const modalDataStore = []

export function ModalLeak() {
  const [isOpen, setIsOpen] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const modalRef = useRef(null)
  const inputRef = useRef(null)

  // 打开弹窗时注册回调
  const handleOpen = () => {
    setIsOpen(true)
  }

  // 每次弹窗打开时注册新的回调（模拟外部事件监听器注册）
  useEffect(() => {
    if (isOpen && modalRef.current && inputRef.current) {
      const inputValue = inputRef.current.value
      const modalContent = modalRef.current.querySelector('.modal-body')?.textContent

      // 危险：将回调存入模块级数组，回调闭包捕获弹窗 DOM 引用
      pendingCallbacks.push(() => {
        // 这个回调引用了已关闭弹窗的内容
        console.log('Modal content:', modalContent)
        console.log('Input value:', inputValue)
        return { content: modalContent, input: inputValue }
      })

      // 存储弹窗相关数据
      modalDataStore.push({
        ref: modalRef.current,
        timestamp: Date.now(),
        data: { content: modalContent, input: inputValue }
      })
    }
  }, [isOpen])

  // 关闭弹窗
  const handleClose = () => {
    setIsOpen(false)
    // 弹窗从 DOM 移除，但 pendingCallbacks 中的回调仍持有 DOM 引用
  }

  // 检查内存泄漏
  const checkLeak = () => {
    const validRefs = modalDataStore.filter(item => item.ref?.isConnected)

    console.log('=== 内存泄漏检查 ===')
    console.log('pendingCallbacks 数量:', pendingCallbacks.length)
    console.log('modalDataStore 数量:', modalDataStore.length)
    console.log('仍在 DOM 中的引用:', validRefs.length)
    console.log('已从 DOM 移除但仍被引用:', modalDataStore.length - validRefs.length)

    setShowReport(true)
  }

  // 触发所有待处理回调（演示泄漏的回调仍可调用）
  const triggerCallbacks = () => {
    pendingCallbacks.forEach((cb, i) => {
      try {
        const result = cb()
        console.log(`回调 ${i} 执行结果:`, result)
      } catch (e) {
        console.error(`回调 ${i} 执行失败:`, e)
      }
    })
  }

  // 清除所有回调
  const clearCallbacks = () => {
    pendingCallbacks.length = 0
    modalDataStore.length = 0
    console.log('已清除所有回调和数据')
  }

  return (
    <div style={{ padding: '20px', borderTop: '1px solid #ccc', marginTop: '20px' }}>
      <h2>Modal 回调闭包内存泄漏</h2>

      <button onClick={handleOpen} disabled={isOpen}>
        打开弹窗
      </button>

      {isOpen && (
        <div
          ref={modalRef}
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            border: '2px solid #2196f3',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 1000,
            minWidth: '300px'
          }}
        >
          <div className="modal-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
            <h3 style={{ margin: 0 }}>弹窗标题</h3>
          </div>
          <div className="modal-body">
            <p>这是弹窗内容，包含一些文本和数据。</p>
            <input
              ref={inputRef}
              type="text"
              placeholder="输入一些数据"
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <p>数据时间戳: {Date.now()}</p>
          </div>
          <div className="modal-footer" style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={handleClose}>关闭</button>
          </div>
        </div>
      )}

      {/* 点击遮罩层关闭 */}
      {isOpen && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999
          }}
        />
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={checkLeak}>检查内存泄漏</button>
        <button onClick={triggerCallbacks} disabled={pendingCallbacks.length === 0}>
          触发回调 ({pendingCallbacks.length})
        </button>
        <button onClick={clearCallbacks}>清除所有</button>
      </div>

      {showReport && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#fce4ec',
          border: '1px solid #e91e63',
          borderRadius: '4px'
        }}>
          <h4>内存泄漏报告</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td><strong>pendingCallbacks 数组长度</strong></td>
                <td>{pendingCallbacks.length}</td>
              </tr>
              <tr>
                <td><strong>modalDataStore 数组长度</strong></td>
                <td>{modalDataStore.length}</td>
              </tr>
              <tr>
                <td><strong>仍在 DOM 中的引用</strong></td>
                <td>{modalDataStore.filter(item => item.ref?.isConnected).length}</td>
              </tr>
              <tr>
                <td><strong>已从 DOM 移除但仍被引用</strong></td>
                <td style={{ color: '#e91e63' }}>
                  {modalDataStore.length - modalDataStore.filter(item => item.ref?.isConnected).length}
                </td>
              </tr>
            </tbody>
          </table>
          <p style={{ color: '#c2185b', marginTop: '10px' }}>
            <strong>问题：</strong>弹窗关闭后，`pendingCallbacks` 中的回调闭包仍持有 DOM 引用和数据，
            导致这些弹窗元素无法被垃圾回收。
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>泄漏原因：</strong></p>
        <ol>
          <li>弹窗打开时，回调闭包被注册到模块级数组 `pendingCallbacks`</li>
          <li>闭包捕获了弹窗的 DOM 引用 (`modalRef.current`) 和输入数据</li>
          <li>弹窗关闭后从 DOM 移除，但回调数组中的闭包仍持有引用</li>
          <li>这些闭包无法被 GC 回收，造成内存泄漏</li>
        </ol>
      </div>
    </div>
  )
}