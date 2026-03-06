// 定义三种状态常量
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class SimplePromise {
    constructor(executor) {
        // 1. 初始化状态
        this.status = PENDING;
        this.value = undefined;      // 成功时的值
        this.reason = undefined;     // 失败时的原因

        // 存储回调队列 (基础版暂不展开微任务队列，仅演示状态锁)
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];

        // 定义 resolve 函数
        const resolve = (value) => {
            // 2. 核心逻辑：只有当状态为 pending 时才允许改变
            // 这保证了状态一旦改变，后续的 resolve/reject 调用无效
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value;

                // 执行所有已注册的成功回调
                this.onFulfilledCallbacks.forEach(fn => fn(this.value));
            }
        };

        // 定义 reject 函数
        const reject = (reason) => {
            // 2. 核心逻辑：同样检查状态，防止重复修改
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.reason = reason;

                // 执行所有已注册的失败回调
                this.onRejectedCallbacks.forEach(fn => fn(this.reason));
            }
        };

        // 立即执行 executor，并捕获同步错误
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        // 基础版 then 逻辑演示
        if (this.status === FULFILLED) {
            onFulfilled(this.value);
        } else if (this.status === REJECTED) {
            onRejected(this.reason);
        } else if (this.status === PENDING) {
            // 如果还是 pending，将回调存入队列
            this.onFulfilledCallbacks.push(onFulfilled);
            this.onRejectedCallbacks.push(onRejected);
        }
    }
}