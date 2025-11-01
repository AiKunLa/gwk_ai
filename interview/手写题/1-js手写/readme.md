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

使用new需要返回一个实例对象
    首选创建一个空对象，并将空对象的__proto__指向构造函数的原型上
    将构造函数的this指向创建的空对象，并执行构造函数
    若构造函数返回的不是一个基本对象，那么返回结果为这个对象，否则返回创建的对象

创建空对象
    const newObj = Object.create(counstruct.prototype)

## promise



## debounce throttle

防抖和节流

## getType 类型判断 typeof

typeof 对于对象只能判断为object ，可以判断基本数据类型。
Object.prototype.toString.call() 获取到数据类型为一个[Object 数据类型]

现在需要一个结合两种类型判断的函数
    若数据为null，则返回 null+‘’
    若对于基本数据类型，则之间使用typeof来判断
    若是对象则使用Object.prototype.toString.call 获取字符串中的数据类型即可
        [Object Array] -> Array

## 手写call apply

手写call
    判断调用的是否为函数
    判断传入的this是否为对象，
    将该函数绑定到传入的上下文中
    通过对象方法的形式来调用函数
    删除绑定的函数
    返回结果

要使用Symbol来创建唯一属性名,来避免对象中的属性冲突
要对传入的context进行判断，严格模式下window为undefined
手写apply的时候，要对第二个参数进行判断，第二个参数必须为数组。

## 手写bind


## 手写柯里化


## 