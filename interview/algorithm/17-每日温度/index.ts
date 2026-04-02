

/**
 * 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指对于第 i 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 0 来代替。
 * @param temperatures 
 */
function dailyTemperatures(temperatures: number[]): number[] {
    const le = temperatures.length
    const stack: number[] = []
    const result: number[] = new Array(le).fill(0)

    for (let i = 0; i < le; i++) {

        // 栈不为空，且当前元素大于栈顶元素
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const peek = stack.pop()
            result[peek] = i - peek
        }

        stack.push(i)
    }

    return result
};