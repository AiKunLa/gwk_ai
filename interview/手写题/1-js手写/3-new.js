function myNew(constructor,...args){
    // 创建一个空的对象
    // 将空对象的__proto__ 链接到构造函数的protype
    // 为防止 constructor 不是函数或没有 prototype 时抛出异常
    const proto = (constructor !== null && typeof constructor === 'function') ? constructor.prototype : Object.prototype;
    const newObj = {};
    newObj.__proto__ = proto;

    // 将构造函数的this指向空对象并执行
    const rtnResult = constructor.apply(newObj,args)

    // 若构造函数没有返回对象或函数，则返回我们创建的对象
    if(rtnResult !== null && (typeof rtnResult === 'object' || typeof rtnResult === 'function')) return rtnResult
    return newObj
}


function Person(name,age){
    this.name = name
    this.age =age
}

const p1 = myNew(Person,'Alice',52)

console.log(p1)