// 基础组件
class Fruit {
    constructor(value) {
        this.value = value
    }

    description() {
        return `this fruit is ${this.value}`
    }

    grow() {
        return `this ${this.value} is growing`
    }
}

// 具体组件
class Apple extends Fruit {
    constructor(value) {
        super(value)
    }

    description() {
        return `an apple, ${super.description()}`
    }
}

// 装饰器基类
class FruitDecorator {
    constructor(fruit) {
        this._fruit = fruit
    }

    description() {
        return this._fruit.description()
    }

    grow() {
        return this._fruit.grow()
    }
}

// 具体装饰器 - 糖装饰器
class SugarDecorator extends FruitDecorator {
    constructor(fruit) {
        super(fruit)
    }

    description() {
        return `${super.description()}, with sugar`
    }
}

// 具体装饰器 - 蜂蜜装饰器
class HoneyDecorator extends FruitDecorator {
    constructor(fruit) {
        super(fruit)
    }

    description() {
        return `${super.description()}, with honey`
    }
}

// 具体装饰器 - 牛奶装饰器
class MilkDecorator extends FruitDecorator {
    constructor(fruit) {
        super(fruit)
    }

    description() {
        return `${super.description()}, with milk`
    }
}

class NewAppleDecorator extends FruitDecorator {
    constructor(fruit) {
        super(fruit)
    }

    description() {
        return `${super.description()},with new`
    }
}


// 使用示例
const apple = new Apple('red')
console.log(apple.description()) // "an apple, this fruit is red"

// 装饰苹果：加糖
const sweetApple = new SugarDecorator(apple)
console.log(sweetApple.description()) // "an apple, this fruit is red, with sugar"

// 装饰苹果：加蜂蜜
const honeyApple = new HoneyDecorator(apple)
console.log(honeyApple.description()) // "an apple, this fruit is red, with honey"

// 装饰苹果：加糖+加牛奶
const milkApple = new MilkDecorator(new SugarDecorator(apple))
console.log(milkApple.description()) // "an apple, this fruit is red, with sugar, with milk"
