function Person() {
  this.age = 18;
  this.name = "123";
  this.play = [1, 2, 3];
}

function Child() {
  this.sex = "男";
}

Child.prototype = new Person();

const c1 = new Child();
const c2 = new Child();

console.log(c1.sex, c1.age, c1.name, c1.play);
console.log(c2.sex, c2.age, c2.name, c2.play);
c1.play.push(4);
console.log(c2.play);