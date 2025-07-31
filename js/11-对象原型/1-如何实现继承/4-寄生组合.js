function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.say = function () {
  console.log(this.name);
};

function Student(score, name, age) {
  Person.call(this, name, age);
  this.score = score;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

const stu1 = new Student(100, "张三", 18);

console.log(stu1.score, stu1.name, stu1.age);
