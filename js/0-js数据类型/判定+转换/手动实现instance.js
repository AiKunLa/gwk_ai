function myInstanceOf(left, right) {
  // 若是left是数据类型则返回false
  if (typeof left !== "object" && typeof left !== 'function' || left === null) return false;

  let lProp = Object.getPrototypeOf(left);

  // 会一直循环到Object.prototype.__proto__ === null
  while (lProp) {
    if (lProp == right.prototype) return true;
    lProp = Object.getPrototypeOf(lProp);
  }
  return false;
}

function Person(name,age){
    this.name = name
    this.age = age
}
function Music(type){
    this.type = type
}

function eat(){
    console.log('eat')

}

const p1 = new Person('a',4)


console.log(myInstanceOf(p1,Person))

console.log(eat instanceof Function)
console.log(myInstanceOf(eat,Function))
console.log(myInstanceOf(p1,Music))