const { number } = require("echarts")

function myInstanceof(obj1,obj2){
    // obj2必须是构造函数  obj1必须是一个对象
    if(typeof obj2 !== 'function'){
        throw new TypeError("右边必须是一个构造函数")
    }

    if(obj1 === null || obj1 === undefined){
        throw new TypeError('右边必须是一个对象')
    }

    let prototype = obj2.prototype

    let proto = Object.getPrototypeOf(obj1)

    while(proto !== null){
        if(proto === prototype) return true
        proto = Object.getPrototypeOf(proto)
    }

    return false
}

// 使用instanceof时，右侧必须是函数（构造器），左侧必须是对象
// 1是基础类型（number类型的字面量），不能用instanceof判断
console.log(1 instanceof Number); // false
console.log(new Number(1) instanceof Number); // true

// 错误写法示例，number不是构造函数，应该是Number（注意大小写）
// console.log(1 instanceof number); // 会报错


console.log(myInstanceof([],Array))



// 测试基本类型
console.log(myInstanceof([], Array));        // true
console.log(myInstanceof({}, Object));       // true
console.log(myInstanceof(() => {}, Function)); // true

// 测试继承
function Parent() {}
function Child() {}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

const child = new Child();
console.log(myInstanceof(child, Child));     // true
console.log(myInstanceof(child, Parent));    // true
console.log(myInstanceof(child, Object));    // true

// 测试原始值
console.log(myInstanceof("hello", String));  // false（字符串字面量不是对象）
console.log(myInstanceof(new String("hello"), String)); // true

// 测试 null 和 undefined
console.log(myInstanceof(null, Object));     // false
console.log(myInstanceof(undefined, Object)); // false

// 测试 Object.create(null)
// Object.create(null) 创建的对象没有原型（即其内部 [[Prototype]] 为 null），不在 Object.prototype 的原型链上
const obj = Object.create(null);
console.log(myInstanceof(obj, Object));      // false（没有原型链，所以不是 Object 的实例）