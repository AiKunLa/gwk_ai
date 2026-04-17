
/**
 * 两个整数之间的 汉明距离 指的是这两个数字对应二进制位不同的位置的数目。
 * @param x 
 * @param y 
 */
function hammingDistance(x: number, y: number): number {
    // & | ^  与或非  
    // 与： 都为1则为1
    // 或： 有1为1，没1为0
    // 非： 相同为0 不同为1
    let n = x ^ y
    let count = 0
    while (n) {
        count += n & 1
        n >>= 1
    }
    return count
};