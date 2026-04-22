function decodeString(s: string): string {
    // 使用栈，遍历到数字或字母 【 字符则压入，遍历到] 则出栈，出栈的若为[则停止
    const stack = []
    let res = ''
    let k = 0
    for (const char of s) {
        if ('a' <= char && char <= 'z') {
            res += char
        } else if ('0' <= char && char <= '1') {
            k = k * 10 + parseInt(char)
        } else if (char === '[') {
            stack.push([res, k])
            k = 0
            res = ''
        } else {
            const [pre_res, pre_k] = stack.pop();
            res = pre_res + res.repeat(pre_k);
        }
    }
    return res
};