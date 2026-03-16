import { useState, useRef, useEffect, useCallback } from 'react'

interface VirtualListProps<T> {
    data: T[]
    height: number
    itemHeight: number
    renderItem: (item: T, index: number) => React.ReactNode
    overscan?: number
}

export function VirtualList<T>({
    data,
    height,
    itemHeight,
    renderItem,
    overscan = 3,
}: VirtualListProps<T>) {
    // 当前滚动位置 scrollTop 的大小由浏览器自动计算，它从0开始，随着用户滚动而增加。我们通过监听 scroll 事件来更新 scrollTop 的值，以便计算出哪些项应该被渲染。
    const [scrollTop, setScrollTop] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const totalHeight = data.length * itemHeight

    // 计算可见范围 开始列表和结束列表的索引。我们根据 scrollTop 和容器高度来计算出当前可见的项的范围。为了避免频繁地添加和移除 DOM 元素，我们还可以添加一个 overscan 参数，来提前渲染一些项，以提供更流畅的滚动体验。
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
        data.length - 1,
        Math.ceil((scrollTop + height) / itemHeight) + overscan
    )

    // 生成可见项
    const visibleItems = []
    for (let i = startIndex; i <= endIndex; i++) {
        visibleItems.push(
            <div
                key={i}
                style={{
                    position: 'absolute',
                    top: i * itemHeight,
                    height: itemHeight,
                    left: 0,
                    right: 0,
                }}
            >
                {renderItem(data[i], i)}
            </div>
        )
    }

    // 监听滚动事件 当用户滚动时，我们需要更新 scrollTop 的值，以便重新计算可见项的范围。我们通过 useEffect 来添加和清除 scroll 事件监听器，并使用 useCallback 来优化 handleScroll 函数的性能。
    const handleScroll = useCallback((e: Event) => {
        const target = e.target as HTMLDivElement
        setScrollTop(target.scrollTop)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        container.addEventListener('scroll', handleScroll, { passive: true })
        return () => container.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
        <div
            ref={containerRef}
            style={{
                height,
                overflow: 'auto',
                position: 'relative',
            }}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                {visibleItems}
            </div>
        </div>
    )
}
