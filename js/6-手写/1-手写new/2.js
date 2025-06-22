function Person(name, age) {
  this.name = name;
  this.age = age;
  return 1
}

Person.prototype.say = function () {
  console.log("name", this.name, "age", this.age);
};

const p = new Person("张三", 18);
console.log(p instanceof Person)
console.log(p);
// 输出：{ name: '张三', age: 18, lable: 'lable' }
