/**
 * 场景：创建一个范围迭代器 (Range Iterator)
 * 目标：让 { start: 1, end: 5 } 这样的对象能被 for...of 遍历
 */

class MyArrIterator {
    constructor(start, end) {
        this.start = start
        this.end = end
    }

    [Symbol.iterator]() {
        let current = this.start
        const end = this.end
        return {
            next: () => {
                if (current <= end) {
                    return { value: current++, done: false }
                } else {
                    return { value: undefined, done: true }
                }
            }
        }
    }

}