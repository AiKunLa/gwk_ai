# 手写new

## 需要考虑什么
- 一个对象创建的过程—— new Person() -> function[[constructor]] -> this指向构造的空对象 ——》 调用 call ——》 {}.__proto__ ——》Constructor.prototype ——》return 对象

## 描述一个对象创建的过程
1. 创建空对象
new 首先会创建一个全新的空对象（ {} ），该对象将作为最终实例对象。

2. 绑定原型链
将新对象的 __proto__ 属性指向构造函数的 prototype 原型对象，建立原型链关系，使实例能继承原型上的属性和方法。

3. 绑定this指向
将构造函数的 this 上下文指向新创建的对象，此时构造函数内部的 this 操作都会作用于该对象。

4. 执行构造函数
执行构造函数内部的代码，完成对新对象的属性初始化（如赋值、方法定义等）。

5. 返回实例对象
- 如果构造函数没有显式返回对象（或返回基本类型值），则默认返回第1步创建的新对象。
- 如果构造函数显式返回一个对象，则最终返回该对象（原创建的空对象会被忽略）。

## 当构造函数有返回值时 

- 返回值是对象的时候 （尊重返回值）
    - 直接返回该对象

- 返回的是简单数据类型时：（因为我们创建的是对象）
    - 忽略返回值，返回新对象
