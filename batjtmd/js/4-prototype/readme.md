# js oop原型
 - 原型是一个对象，它包含了一个对象的属性和方法。
 - js中使用函数来创建对象，函数的prototype属性指向了这个对象的原型。

 实例代码：
 ```js
 function Person(name, age) { // 使用大写字母开头的函数名来表示构造函数
  this.name = name;
  this.age = age;
 }

 Person.prototype.sayHello = function() { // 使用prototype属性来添加方法
  console.log('Hello, my name is ' + this.name);
 }

 const person1 = new Person('Tom', 18); // 使用new关键字来创建对象
 const person2 = new Person('Jerry', 20);
 person1.sayHello(); // Hello, my name is Tom
 person2.sayHello(); // Hello, my name is Jerry
 ```




## 原型的作用
 - 原型的作用是为了实现继承。
 - js中new出来的对象和构造函数的prototype属性指向的对象是同一个对象。
 - 所以，new出来的对象可以访问构造函数的prototype属性指向的对象的属性和方法。
 - __proto__属性指向的对象是构造函数的prototype属性指向的对象。 __proto__与new
