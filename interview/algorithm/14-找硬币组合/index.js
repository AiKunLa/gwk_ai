function coinChangeDP(coins, amount) {
    const amountArr = new Array(amount + 1).fill(Infinity)
    amountArr[0] = [0]

    for (let i = 1; i < amountArr.length; i++) {
        for (const coin of coins) {
            if (i - coin >= 0) {
                // 如果当前面值减去当前硬币面值，
                amountArr[i] = Math.min(amountArr[i], amountArr[i - coin])
            }
        }

        return amountArr[amount] === Infinity ? -1 : amountArr[amount]
    }
}