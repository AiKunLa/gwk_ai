function partition(nums: number[], left: number, right: number): number {
    // 随机选择基准，并与左端点交换
    const idx = left + Math.floor(Math.random() * (right - left + 1));
    const pivot = nums[idx];
    [nums[idx], nums[left]] = [nums[left], nums[idx]];

    let i = left + 1, j = right;
    while (true) {
        while (i <= j && nums[i] < pivot) i++;
        while (i <= j && nums[j] > pivot) j--;
        if (i >= j) break;
        [nums[i], nums[j]] = [nums[j], nums[i]];
        i++;
        j--;
    }

    // 将基准放到正确位置（与 j 交换）
    [nums[left], nums[j]] = [nums[j], nums[left]];
    return j;
}

function quickSort(nums: number[], left: number, right: number): void {
    // 若子数组已有序，直接返回（小优化）
    let ordered = true;
    for (let i = left; i < right; i++) {
        if (nums[i] > nums[i + 1]) {
            ordered = false;
            break;
        }
    }
    if (ordered) return;

    const pivotIndex = partition(nums, left, right);
    quickSort(nums, left, pivotIndex - 1);
    quickSort(nums, pivotIndex + 1, right);
}

function sortArray(nums: number[]): number[] {
    quickSort(nums, 0, nums.length - 1);
    return nums;
}