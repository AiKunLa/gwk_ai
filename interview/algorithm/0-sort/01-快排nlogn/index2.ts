function sortArray(nums: number[]): number[] {
    const quickSort = (left: number, right: number): void => {
        if (left >= right) return;

        // 随机选择基准，并与最左侧交换（简化分区逻辑）
        const idx = left + Math.floor(Math.random() * (right - left + 1));
        const pivot = nums[idx];
        [nums[idx], nums[left]] = [nums[left], nums[idx]];

        let i = left + 1;
        let j = right;
        while (i <= j) {
            while (i <= j && nums[i] < pivot) i++;
            while (i <= j && nums[j] > pivot) j--;
            if (i <= j) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
                j--;
            }
        }
        // 将基准放到 j 位置（因为 j 是最后一个 <= pivot 的位置）
        [nums[left], nums[j]] = [nums[j], nums[left]];

        quickSort(left, j - 1);
        quickSort(j + 1, right);
    };

    quickSort(0, nums.length - 1);
    return nums;
}

function sortArray(nums: number[]): number[] {
    const quickSort = (left: number, right: number): void => {
        if (left >= right) return;
        const indexNum = left + Math.floor(Math.random() * (right - right + 1))
        const pivot = nums[indexNum];
        [nums[indexNum], nums[left]] = [nums[left], nums[indexNum]]

        let i = left + 1, j = right
        while (i <= j) {
            while (i <= j && nums[i] < pivot) i++;
            while (i <= j && nums[j] > pivot) j--;
            if (i <= j) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++
                j--
            }
        }
        [nums[left], nums[j]] = [nums[j], nums[left]];
        quickSort(left, j - 1);
        quickSort(j + 1, right);
    }
    quickSort(0, nums.length - 1);
    return nums;
}