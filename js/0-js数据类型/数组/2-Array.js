const arr = new Array(5)
console.log(arr.hasOwnProperty(0)) // 表示查找有没有该属性，不回去找原型链上的

let obj = {
    name: 'a',
    age: 18
}
let obj2 = {
    kkk: '123',
}

obj.__proto__ = obj2
console.log(obj.kkk) // 可以拿到

for(let key in obj){ // 可以拿到所有的key，包括原型链上的
    console.log(obj[key])
}

console.log(obj.hasOwnProperty('name'))

