/** 手写 new 操作符
 * 用法：创建一个实例化对象
 * 思路：
 *  1、判断传入的 fn 是否为 function
 *  2、创建一个空对象
 *  3、将这个空对象的原型设置为构造函数的 prototype 属性。
 *  4、使用 apply 执行构造函数 并传入参数 arguments 获取函数的返回值
 *  5、判断这个返回值 如果返回的是 Object || Function 类型 就返回该对象 否则返回创建的对象
 * @param {Function} fn 构造函数
 * @return {*}
 */

function myNew(construct, ...args) {
    // 判断传入的函数是否是函数
    // 创建一个空的对象并将空对象的原型设置为构造函数的原型
    // 执行构造函数,并将他的this指向空对象
    // 若构造函数返回的是对象或函数则直接返回这个对象或函数，若不是则返回创建的对象
    if (typeof construct !== 'function') throw new TypeError('constructor must be a function');
    const newObj = Object.create(construct.prototype)
    let result = construct.apply(newObj, args)
    return ((result !== null && typeof result === 'object') || typeof result === 'function') ? result : newObj
}

function myNew2(construct, ...args) {
    if (typeof construct !== 'function') throw new TypeError('construct must be a function')
    const newObje = Object.create(construct.prototype)
    const result = construct.apply(newObje, args)
    return ((result !== null && typeof result === 'object') || typeof result === 'function') ? result : newObje
}