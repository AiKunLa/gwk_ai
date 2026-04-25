function maxProfit(prices: number[]): number {
    // 低买高卖
    // 用一个变量来维护最小值，然后找到最大的差值
    let res = 0
    let minPrice = prices[0]
    for (const price of prices) {
        res = Math.max(res, price - minPrice)
        minPrice = Math.min(minPrice, price) // 找最小值
    }
    return res
};