
class MinStack2 {
    stack: number[]
    minNumber: number
    constructor() {
        this.stack = []
        this.minNumber = Infinity
    }

    push(val: number): void {
        this.stack.push(val)
        
    }

    pop(): void {
        if (this.stack.length === 0) {
            return
        }
        this.stack.pop()

    }

    top(): number {
        return this.stack[this.stack.length - 1]
    }

    getMin(): number {
        return this.minStack[this.minStack.length - 1]
    }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */