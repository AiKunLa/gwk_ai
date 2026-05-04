function trap(height: number[]): number {
    // 找到两区间的高点，或相同高点，取小高点，对区间内的每个数做减法，并求和
    // 用单调栈来找两端，单调递增栈，若当前元素大于栈栈顶元素则入栈，若小于则当前栈顶元素就是左区间或有区间，先将其作为左区间来抗
    // 栈底元素一定区间是最小值，若左右区间小于等于栈低元素则continue
    if (height.length < 3) return 0
    let totalRain = 0
    const stack: number[] = []
    stack.push(height[1])
    let left = 0, right = 2
    while (right < height.length) {
        if (stack[stack.length - 1] > height[right]) {
            // 若小于当前栈顶元素就是找到了有区间点
            // 若左区间小于等于栈低元素则continue
            if (height[left] <= stack[0]) {
                left = right - 1
            } else {
                const minheight = Math.min(height[left], height[right - 1])
                for (let i = right - 1; i > left; i--) {
                    if (height[i] > minheight) break
                    totalRain += minheight - height[i]
                }
            }
            // 清空栈
            stack.length = 0
            stack.push(height[right])
        }
        stack.push(height[right])
        right++
    }
    return totalRain
};


function trap(height: number[]): number {
    let totalRain = 0;
    const stack: number[] = [];   // 存下标，栈内对应高度递减

    for (let i = 0; i < height.length; i++) {
        // 当前高度比栈顶高度更高时，说明栈顶是低洼，可以积水
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const top = stack.pop()!;               // 低洼处下标
            if (stack.length === 0) break;          // 左边没有更高的墙，无法积水

            const left = stack[stack.length - 1];   // 左边界下标
            const width = i - left - 1;             // 积水的宽度
            const boundedHeight = Math.min(height[left], height[i]) - height[top]; // 积水高度
            totalRain += width * boundedHeight;
        }
        stack.push(i);
    }

    return totalRain;
}

// 使用hMaxL 记录左边遍历到的最高墙，使用hMaxR记录右边
// 用两个指针进行遍历，矮的一边指针前进一，然后和这一边的最高墙进行比较，若小于则代表这里可以存水，若大于则更新这一侧的最高墙

function trap(height: number[]): number {
    if (height.length === 0) return 0;
    let totalRain = 0, hMaxL = 0, hMaxR = 0, left = 0, right = height.length - 1
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] < hMaxL) {
                totalRain += hMaxL - height[left]
            } else {
                hMaxL = height[left]
            }
            left++
        } else {
            if (height[right] < hMaxR) {
                totalRain += hMaxR - height[right]
            } else {
                hMaxR = height[right]
            }
            right--
        }
    }
    return totalRain
}