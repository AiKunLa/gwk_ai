function Person(name) {
  this.name = name;
}
function Car(prise) {
  this.prise = prise;
}
const p1 = new Person("zs");
console.log(p1 instanceof Person); // true
console.log(p1 instanceof Object); // true

console.log(Car instanceof Object); // true
console.log(p1 instanceof Car); // false
