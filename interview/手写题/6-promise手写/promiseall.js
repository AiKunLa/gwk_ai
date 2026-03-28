/**
实现 Promise.all 的核心逻辑在于：
遍历传入的可迭代对象（通常是数组）。
将每个元素（可能是 Promise 或普通值）都转换为 Promise。
维护一个计数器，记录已完成的 Promise 数量。
维护一个结果数组，按顺序存储结果。
一旦有一个 Promise 失败（reject），立即拒绝（reject）整个 Promise.all。
只有当所有 Promise 都成功（resolve）时，才 resolve 最终的结果数组。
 */

function promiseAll(iterable) {
    return new Promise((resolve, reject) => {
        const promises = Array.from(iterable)
        const resultArr = new Array(promises.length)

        let completedCount = 0;

        if (promises.length === 0) {
            resolve(resultArr)
            return
        }

        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then((value) => {
                resultArr[i] = value
                completedCount++
                if (completedCount === promises.length) {
                    resolve(resultArr)
                }
            }).catch((error) => {
                reject(error)
            })
        }

    })
}



function myPromiseAll(iterable) {
    return new Promise((resolve, reject) => {
        const promises = Array.from(iterable)
        const resultArr = new Array(promises.length)

        const completedCount = 0
        if (promises.length === 0) {
            resolve(resultArr)
            return
        }

        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i]).then((value) => {
                resultArr[i] = value
                completedCount++
                if (completedCount === promises.length) {
                    resolve(resultArr)
                }
            }).catch((e) => {
                reject(e)
            })
        }
    })
}