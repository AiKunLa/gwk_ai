function generateParenthesis(n: number): string[] {
    // 回溯 使用lcount来表示有多少左括号需要匹配，只有lcount数量大于1的时候才能匹配右括号
    const maxLen = n * 2
    const resArr: string[] = []
    const dfsBack = (lcount: number, preStr: string, usedLcur: number): void => {
        if (preStr.length === maxLen) {
            resArr.push(preStr)
            return
        }
        // 若lcount > 0 则有两种选择，一个是选择左括号一个是选择右括号
        // 但是已经使用左括号数量不能超过n

        // 使用左括号

        if (usedLcur < n) {
            dfsBack(lcount + 1, preStr + '(', usedLcur + 1)
        }
        // 使用右括号
        if (lcount > 0) dfsBack(lcount - 1, preStr + ')', usedLcur)
    }
    dfsBack(0, '', 0)
    return resArr
};