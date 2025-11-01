Function.prototype.myBind = function (context, ...args) {
  if (typeof this !== "function") {
    return new TypeError("必须为函数所调用");
  }

  const self = this;
  function Empty() {}

  function bindFn(...callArgs) {
    // 判断是否为new
    context = this instanceof bindFn ? this : context;
    return self.apply(context, args.concat(callArgs));
  }

  // 这段代码的作用是让通过 new 调用 myBind 绑定后的函数时，实例能够继承原函数的原型属性，实现原型链继承。
  // 1. 将 Empty 的 prototype 设为原函数的 prototype，用于中转，防止直接修改原函数的 prototype。
  // 2. 再把 bindFn 的 prototype 指向 new Empty()，建立原型链。
  if (self.prototype) {
    Empty.prototype = self.prototype;
    bindFn.prototype = new Empty();
  }

  return bindFn;
};

function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.say = function () {
  console.log(`I'm ${this.name}, ${this.age} years old.`);
};

const Alice = Person.myBind(null, 'Alice');
const alice = new Alice(25);
alice.say();


// 普通调用 
const obj = { name: 'Bob' };
const greet = function (greeting) {
  return `${greeting}, ${this.name}!`;
};
const boundGreet = greet.myBind(obj, 'Hello');
console.log(boundGreet()); // "Hello, Bob!"