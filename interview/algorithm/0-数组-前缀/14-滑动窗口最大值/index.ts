function maxSlidingWindow(nums: number[], k: number): number[] {
    // 维护一个单调队列，左边出，右边进去。然后 新来的元素入队并维护队列单调性，新元素比最强的老元素强则 老元素则直接舍去即可，若老元素不在队列中了也舍去即可
    const result: number[] = []
    const queue: number[] = []
    for (let i = 0; i < nums.length; i++) {
        // 若队列尾部的元素小于新入队的元素，则队尾的元素永远不可能被使用
        while (queue.length > 0 && nums[queue[queue.length - 1]] < nums[i]) {
            queue.pop()
        }
        queue.push(i)

        // 若对头元素不在滑动窗口内部则出队列
        let left = i - k + 1
        while (queue.length > 0 && queue[0] < left) {
            queue.shift()
        }
        result.push(nums[queue[0]])
    }
    return result
};