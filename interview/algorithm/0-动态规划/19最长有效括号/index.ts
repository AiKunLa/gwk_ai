function longestValidParentheses(s: string): number {
    // 使用一个数组来记录当前括号是否匹配，最近匹配原则  true为匹配 false为没有匹配
    // 遍历字符串 使用栈来记录(括号, 遇到左括号就入栈（下标），遇到右括号就出栈进行匹配 将两者的记录设置为true
    // 最后遍历一下记录数组，连续true的最长值

    const target: boolean[] = Array(s.length).fill(false)
    const stack: number[] = []

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i)
            continue
        } else if (stack.length > 0) {
            const index = stack.pop()!
            target[index] = true
            target[i] = true
        }
    }

    let ans = 0, count = 0
    for (const vale of target) {
        if (vale) {
            count++
            ans = Math.max(ans, count)
        } else {
            count = 0
        }
    }
    return ans
};