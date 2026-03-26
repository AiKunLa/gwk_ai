function Person(name, age) {
    this.name = name
    this.age = age
}

Person.prototype.say = function () {
    console.log(`${this.name} say I am ${this.age} old`)
}

Person.TYPE = 'Person'

const p1 = new Person('小明', 19)
const p2 = new Person('张三', 18)

p1.say()
p2.say()

console.log(Person.prototype) // { say: [Function (anonymous)] }
console.log(p1.__proto__) // { say: [Function (anonymous)] }

console.log(p1.__proto__ === Person.prototype) // true