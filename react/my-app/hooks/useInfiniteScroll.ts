import { useEffect, useRef } from "react";

/**
 * 无限滚动 Hook
 * @param loaderMore - 加载更多的回调函数
 * @param hasMore - 是否还有更多数据
 * @param threshold - 元素可见比例阈值（默认 0）
 * @param rootMargin - 视口扩展距离（默认 '0px 0px 10px 0px'，即距底部 10px 触发）
 */
export function useInfiniteScroll({
    loaderMore,
    hasMore,
    threshold = 0,
    rootMargin = '0px 0px 10px 0px'
}: {
    loaderMore: () => void;
    hasMore: boolean;
    threshold?: number;
    rootMargin?: string;
}) {
    // 用于绑定到加载指示器元素的 ref
    const lodRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 创建 Intersection Observer
        const observer = new IntersectionObserver(([entry]) => {
            // 当元素进入视口时触发加载
            if (entry.isIntersecting) {
                loaderMore();
            }
        }, {
            threshold,    // 可见比例阈值
            rootMargin    // 视口扩展范围
        });

        // 观察加载指示器元素
        if (lodRef.current) {
            observer.observe(lodRef.current);
        }

        // 组件卸载时取消观察
        return () => {
            if (lodRef.current) {
                observer.unobserve(lodRef.current);
            }
        };
    }, [loaderMore, hasMore, threshold, rootMargin]);

    // 返回 ref，需绑定到加载指示器元素
    return lodRef;
}