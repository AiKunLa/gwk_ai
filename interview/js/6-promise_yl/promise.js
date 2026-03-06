const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class SimplePromise {
    constructor(excurer) {
        this.status = PENDING
        this.value = undefined
        this.error = undefined

        // 存储回调队列 (基础版暂不展开微任务队列，仅演示状态锁)
        this.onFulfilledStack = []
        this.onRejectedStack = []

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = FULFILLED
                this.value = value

                this.onFulfilledStack.forEach((fn) => fn(value))
            }

        }

        const reject = (error) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.error = error

                this.onRejectedStack.forEach((fn) => fn(error))
            }
        }

        try {
            excurer(resolve, reject)
        } catch (error) {
            reject(error)
        }

    }


    then(onFulfilled, onRejected) {
        if (this.status === FULFILLED) {
            onFulfilled(this.value)
        } else if (this.status === REJECTED) {
            onRejected(this.error)
        } else {
            this.onFulfilledStack.push(onFulfilled)
            this.onRejectedStack.push(onRejected)
        }
    }

}