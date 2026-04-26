function removeInvalidParentheses(s: string): string[] {
    const res: Set<string> = new Set()
    let l = 0
    let r = 0
    for (const c of s) {
        if (c === '(') l++
        if (c === ')') r++
    }
    const max = Math.min(l, r)
    let len = 0
    const dfs = (index: number, curStr: string, source: number) => {
        if (source < 0 || source > max) return
        if (index === s.length) {
            if (source === 0 && curStr.length >= len) {
                if (curStr.length > len) res.clear()
                len = curStr.length
                res.add(curStr)
            }
            return;
        }

        const c = s[index]

        if (c === '(') {
            dfs(index + 1, curStr + c, source + 1)
            dfs(index + 1, curStr, source)
        } else if (c === ')') {
            dfs(index + 1, curStr + c, source - 1)
            dfs(index + 1, curStr, source)
        } else {
            dfs(index + 1, curStr + c, source)
        }

    }
    dfs(0, '', 0)

    return [...res]
};