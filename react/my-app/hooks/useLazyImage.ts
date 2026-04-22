import { useEffect, useRef, useState } from "react";

export function useLazyImage(
    src: string,
    placeholderSrc: string,
    rootMargin: string = '0px 0px 100px 0px'
) {
    // 图片是否已加载
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (!src) return;

        const img = imgRef.current;
        if (!img) return;

        // 重置状态（当 src 变化时）
        setIsLoaded(false);
        // 先显示占位图
        img.src = placeholderSrc;

        // 创建 observer
        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // 进入可视区域 → 加载真实图片
                    img.src = src;
                    observerRef.current?.disconnect();
                }
            },
            { rootMargin }
        );

        observerRef.current.observe(img);

        // 图片加载完成的回调
        const handleLoad = () => setIsLoaded(true);
        img.addEventListener('load', handleLoad);

        return () => {
            observerRef.current?.disconnect();
            img.removeEventListener('load', handleLoad);
        };
    }, [src, placeholderSrc, rootMargin]); // 注意：依赖项变化时重新建立 observer

    return { imgRef, isLoaded };
}