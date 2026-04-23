function topKFrequent2(nums: number[], k: number): number[] {
    // 使用桶排序
    // 遍历一遍并用hashmap存储起来，并记录最大值，然后创建一个桶容器，遍历map将次数相同的放入同一个桶中
    const map: Map<number, number> = new Map();
    let max = 0;

    for (const num of nums) {
        const cur = (map.get(num) || 0) + 1;
        map.set(num, cur);
        max = Math.max(max, cur);
    }

    // 桶的索引表示频率，值为该频率的所有数字
    const buckets: number[][] = Array.from({ length: max + 1 }, () => []);

    for (const [key, value] of map) {
        buckets[value].push(key);
    }

    const res: number[] = [];
    // 从高频率往低频率遍历
    for (let i = max; i > 0 && res.length < k; i--) {
        res.push(...buckets[i]);
    }

    return res.slice(0, k);
}