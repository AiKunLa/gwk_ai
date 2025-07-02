console.log(Object.prototype.toString.call(null)) // [object Null]

console.log(Object.prototype.toString.call(2)) // [object Number]

console.log(Object.prototype.toString.call(name)) // name is not defined

Object.prototype.toString.call([]) // [object Array]
Object.prototype.toString.call(new Date()) // [object Date]
