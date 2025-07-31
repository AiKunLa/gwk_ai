

function Person() {
  this.name = "张三";
  this.age = 18;
  this.say = () => { /// 这样写的话，每个实例都要创建这个方法，这样会占用内存  应该写在原型上
    console.log(this.name);
  };
}
Person.prototype.say = function () {
  console.log(this.name);
};

function Student() {
  Person.call(this);
  this.score = 100;
}

Student.prototype = new Person();
const stu = new Student();
const per = new Person();

console.log(stu.name, stu.age, stu.score);

per.say();
stu.say();
