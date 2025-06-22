function objectFactory() {
  //创建空对象
  let obj = {};

  // 绑定this指向
  // 获取argument中第一个参数  由于argument没有shift方法 这里将this指向argument
  let Constructor = [].shift.call(arguments);

  let result = Constructor.apply(obj, arguments); // 执行构造函数this 指向obj

  //绑定原型链
  obj.__proto__ = Constructor.prototype;

  // 若构造函数有返回值

  //   return typeof result === 'object'?result:obj;
  // 若构造函数返回的是一个不为null的对象则返回 result 否则返回obj
  // 若是一个null对象 result || obj 返回的是obj
  return typeof ret === "object" ? result || obj : obj;
}

function Person(name, age) {
  this.name = name;
  this.age = age;
  return {
    name,
    age,
  };
}

Person.prototype.say = function () {
  console.log("name", this.name, "age", this.age);
};
//与这个相同 let p = new Person("张三",18)
let p = objectFactory(Person, "张三", 18);
console.log(p); // （这里由Person原型链指向 代表是谁的实例化） Person { name: '张三', age: 18 }
console.log(p instanceof Person); // 构造时有  obj.__proto__ = Constructor.prototype; 所以为true
p.say();
