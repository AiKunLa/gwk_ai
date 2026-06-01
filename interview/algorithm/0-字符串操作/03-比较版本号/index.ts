function compareVersion(version1: string, version2: string): number {
    //先分割字符串成数组，在比较每一项即可
    // 去两个中项数最大的作为while循环，遍历每一项，若不存在则设为0
    // 对于每一项的字符处理，去除前缀0之后再进行比较，parseInt Number可以自动将前面的零忽略掉
    // 比较大小 相对则继续循环
    const arrV1 = version1.split('.')
    const arrV2 = version2.split('.')
    const n = arrV1.length > arrV2.length ? arrV1.length : arrV2.length
    let index = 0
    while (index < n) {
        const num1 = (index < arrV1.length) ? parseInt(arrV1[index]) : 0
        const num2 = (index < arrV2.length) ? parseInt(arrV2[index]) : 0
        if (num1 < num2) return -1
        if (num1 > num2) return 1
        index++
    }
    return 0
};