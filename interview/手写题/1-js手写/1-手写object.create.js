function myCreateObject(obj) {
    function F() {}
    F.prototype = obj
    return new F()
}

function myCreate(obj){
    if(typeof obj !== 'object' || obj === null) {
        throw new TypeError('Object prototype may only be an Object or null')   
    }
    function F(){}
    F.prototype = obj
    return new F()
}

const parent = {
    name:"parent",
    sayHello(){
        console.log("parent say hello")
    }
}

const child = myCreate(parent)

console.log(child.name)

child.sayHello()

// 为什么为false
// child._proto_ 实际上是 undefined，标准属性是 child.__proto__ 或 Object.getPrototypeOf(child)
// 因此 child._proto_ === parent 为 false，因为 _proto_ 不是 JS 的原生属性
console.log(child._proto_ === parent) // false

// 正确方式应该是：
console.log(child.__proto__ === parent) // true
console.log(Object.getPrototypeOf(child) === parent) // true

// 这里为false，是因为prototype是函数才有的属性，child是一个普通对象，没有prototype属性。
// 正确查找原型链应该用__proto__或Object.getPrototypeOf
console.log(child.prototype === parent) // false

console.log(Object.getPrototypeOf(child))


function myCreate(obj){
    function fn(){}
    fn.prototype = obj
    return new fn()
}