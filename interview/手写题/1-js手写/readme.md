# js基础手写体

## Object.create()

该方法用于创建一个新对象，并将该对象的原型设置为指定对象的方法

注意点：传入的参数必须是对象，且不能为null

prototype 是函数对象的原型，只存在于函数对象上，一般是构造函数。用于实现继承和共享方法或属性
当函数作为构造函数使用时，通过new创建的实例对象的__proto__会指向构造函数的prototype

__proto__存在于所有对象上，它是对象内部原型的引用，指向创建该对象的构造函数上的prototype。它是实现属性和方法继承的关键

child.__proto__ 和 Object.getPrototypeOf(child) 用于获取 child 对象的原型对象（即其内部[[Prototype]]属性）

## instanceof

正确用法为：obj1 instanceof 构造函数
instanceof 用于判断 构造函数.prototype 是否出现在 obj1 的原型链上。
例如：obj1 instanceof Foo 实际判断的是 Foo.prototype 是否在 obj1 的原型链上。

注意点： 左边必须是一个对象，右边必须是一个构造函数。
判断点： 定义 right为构造函数的prototype  left为Object.getPrototypeOf(left)
    循环判断，当left不为空时间
        循环内部 当left === right 返回true  
            left = Object.getPrototypeOf(left) 沿着原型链上查找
    返回false

## new

