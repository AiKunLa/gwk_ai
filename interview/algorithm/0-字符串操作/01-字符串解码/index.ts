function decodeString(s: string): string {
    // 使用栈，遍历到数字或字母 【 字符则压入，遍历到] 则出栈，出栈的若为[则停止
    const stack: [string, number][] = []
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
            const popped = stack.pop();
            if (!popped) {
                throw new Error("Invalid input: mismatched brackets");
            }
            const [pre_res, pre_k] = popped;
            res = pre_res + res.repeat(pre_k);
        }
    }
    return res
};


function decodeString2(s: string): string {
    const stack: [string, number][] = []
    let res = ''
    let k = 0
    for (const c of s) {
        if (c >= 'a' && c < 'z') {
            res += c
        } else if (c >= '0' && c <= '9') {
            k = k * 10 + parseInt(c)
        } else if (c === '[') {
            stack.push([res, k])
            res = ''
            k = 0
        } else {
            const [preStr, n] = stack.pop()!
            res = preStr + res.repeat(n)
        }
    }
    return res
}