class MyQueue {
    constructor() {
        this.stack1 = []
        this.stack2 = []
    }

    // 出队列时，若stack1栈有数据，则直接从stack1出栈，若没有则将stack2的所有数据压入stack1
    pop() {
        if (this.stack1.length <= 0) {
            this.pushStack1ToStack2()
        }
        return this.stack1.pop()
    }


    // 入队列，直接入stack2

    push(value) {
        this.stack2.push(value)
    }

    // 将stack2 的数据压入 stack1中
    pushStack2ToStack1() {
        while (this.stack2.length > 0) {
            this.stack1.push(this.stack2.pop())
        }
    }

    // 获取队头元素
    queuePeek() {
        if (this.stack1.length <= 0) {
            this.pushStack1ToStack2()
        }
        return this.stack1[this.stack1.length - 1]
    }
}