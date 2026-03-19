class RangeIterator {
    constructor(strat, end) {
        this.current = strat;
        this.end = end;
    }

    next() {
        if (this.current < this.end) {
            return {
                value: this.current++,
                done: false
            }
        } else {
            return {
                value: undefined,
                done: true
            }
        }
    }
}


// 定义一个可迭代对象
class Range {
    constructor(strat, end) {
        this.strat = strat;
        this.end = end;
    }

    [Symbol.iterator]() {
        return new RangeIterator(this.strat, this.end);
    }
}

const range = new Range(0, 5);

for (const num of range) {
    console.log(num);
}