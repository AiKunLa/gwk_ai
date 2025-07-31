function Person() {
  this.name = "张三";
  function say() {
    console.log(this.name);
  }
}

function Student() {
  Person.call(this);
  this.score = 100;
}

const st1 = new Student();

console.log(st1.name, st1.score);
console.log(st1.say()); // 访问不了
