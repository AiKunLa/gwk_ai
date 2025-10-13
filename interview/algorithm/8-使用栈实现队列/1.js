class MyQueue {
    constructor() {
        this.inStack = []
        this.outStack = []
    }
    queuePush(x) {
        this.inStack.push(x)
    }

    // 出队列 在数组尾部操作
    queuePop() {
        if(this.outStack.length === 0) {
            this.moveInToOut()
        }
        return this.outStack.pop()
    }

    // 将队尾栈的数据全部放到队头栈中
    moveInToOut() {
        while(this.inStack.length > 0) {
            this.outStack.push(this.inStack.pop())
        }
    }

    queuePeek() {
        if(this.outStack.length === 0) {
            this.moveInToOut()
        }
        return this.outStack[this.outStack.length - 1]
    }
    
}

const myQueue = new MyQueue()
myQueue.queuePush(1)
myQueue.queuePush(2)
myQueue.queuePush(3)
console.log(myQueue.queuePop())
console.log(myQueue.queuePop())
console.log(myQueue.queuePop())