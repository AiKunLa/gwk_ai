function topKFrequent(nums: number[], k: number): number[] {
    // 统计每个数字的频率
    const freqMap = new Map<number, number>();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    // 小顶堆：[频率, 数字]
    const heap: [number, number][] = [];

    const swap = (i: number, j: number) => {
        [heap[i], heap[j]] = [heap[j], heap[i]];
    };

    // 上浮操作
    const heapPush = (item: [number, number]) => {
        heap.push(item);
        let index = heap.length - 1;
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (heap[index][0] >= heap[parent][0]) break;
            swap(index, parent);
            index = parent;
        }
    };

    // 下沉操作
    const heapPop = () => {
        const top = heap[0];
        const last = heap.pop()!;
        if (heap.length > 0) {
            heap[0] = last;
            let index = 0;
            while (true) {
                const left = 2 * index + 1;
                const right = 2 * index + 2;
                let smallest = index;
                if (left < heap.length && heap[left][0] < heap[smallest][0]) {
                    smallest = left;
                }
                if (right < heap.length && heap[right][0] < heap[smallest][0]) {
                    smallest = right;
                }
                if (smallest === index) break;
                swap(index, smallest);
                index = smallest;
            }
        }
        return top;
    };

    // 遍历频率表，构建堆
    for (const [num, freq] of freqMap) {
        heapPush([freq, num]);
        // 保持堆大小为 k
        if (heap.length > k) {
            heapPop();
        }
    }

    // 取出堆中所有元素并返回数字
    const result: number[] = [];
    while (heap.length > 0) {
        result.push(heapPop()[1]);
    }
    return result;
}