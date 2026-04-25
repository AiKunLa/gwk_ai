import { useState, useEffect, useRef } from 'react'

// 危险：模块级存储保留已删除 DOM 元素的引用
const retainedRefs = []
// 危险：全局回调数组模拟内存泄漏
const globalHandlers = []

export function DomEnvent() {
    const [mountKey, setMountKey] = useState(0)
    const [showInfo, setShowInfo] = useState(false)
    const containerRef = useRef(null)

    // 每次挂载创建新的 DOM 元素引用并保存
    useEffect(() => {
        const el = document.getElementById('leak-target')
        if (el) {
            // 危险：将 DOM 引用存入模块级数组
            retainedRefs.push(el)
            globalHandlers.push(() => {
                console.log('Handler for:', el.id)
            })

            // 为元素添加点击事件监听
            el.addEventListener('click', () => {
                console.log('Clicked:', el.textContent)
            })

            console.log('保存了 DOM 引用，当前 retainedRefs 长度:', retainedRefs.length)
        }

        return () => {
            // 注意：这里只是解绑事件，但没有从 retainedRefs 移除引用
            const el = document.getElementById('leak-target')
            if (el) {
                el.removeEventListener('click', () => { })
            }
            // 引用仍然保留在 retainedRefs 中
        }
    }, [mountKey])

    const handleRemoveAndRemount = () => {
        // 移除 DOM 元素
        const el = document.getElementById('leak-target')
        if (el && el.parentElement) {
            el.parentElement.removeChild(el)
        }

        // 重新挂载组件（key 变化使 React 重新创建 DOM）
        setMountKey(k => k + 1)
    }

    const checkMemoryLeak = () => {
        // 检测 retainedRefs 中的元素是否仍存在于 DOM 中
        const validRefs = retainedRefs.filter(el => el.isConnected)
        console.log('retainedRefs 长度:', retainedRefs.length)
        console.log('仍在 DOM 中的引用:', validRefs.length)
        console.log('已从 DOM 中移除但仍被保留的引用:', retainedRefs.length - validRefs.length)

        setShowInfo(true)
    }

    return (
        <div style={{ padding: '20px' }}>
            <h2>DOM 引用内存泄漏案例</h2>

            <div ref={containerRef}>
                {/* key 变化会使 React 重新创建这个元素 */}
                <div id="leak-target" style={{
                    padding: '20px',
                    backgroundColor: '#e3f2fd',
                    border: '1px solid #2196f3',
                    marginBottom: '10px'
                }}>
                    可点击的元素（点击后会保留引用）
                </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button onClick={handleRemoveAndRemount}>
                    删除并重新挂载
                </button>
                <button onClick={checkMemoryLeak}>
                    检查内存泄漏
                </button>
            </div>

            {showInfo && (
                <div style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#fff3e0',
                    border: '1px solid #ff9800'
                }}>
                    <h4>内存泄漏分析：</h4>
                    <ul>
                        <li>retainedRefs 数组长度: <strong>{retainedRefs.length}</strong></li>
                        <li>仍在 DOM 中: <strong>{retainedRefs.filter(el => el.isConnected).length}</strong></li>
                        <li>已移除但仍被引用: <strong>{retainedRefs.filter(el => !el.isConnected).length}</strong></li>
                    </ul>
                    <p style={{ color: '#d84315', marginTop: '10px' }}>
                        危险：已删除的 DOM 元素引用仍被 retainedRefs 数组持有，
                        导致这些元素无法被垃圾回收。
                    </p>
                </div>
            )}

            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                <p><strong>问题原因：</strong></p>
                <p>1. DOM 引用被存入模块级数组 retainedRefs</p>
                <p>2. 当元素从 DOM 移除后，引用仍被数组持有</p>
                <p>3. 每个引用关联的事件监听器也无法释放</p>
            </div>
        </div>
    )
}