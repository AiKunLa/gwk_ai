'name'.split('') // 简单数据类型没有split方法，但是可以使用.split()方法，因为js会自动将字符串转换为对象 这种方式称为隐式转换
console.log('name' == new String('name'))
console.log('name' === new String('name')) // false 因为类型不同，所以不相等

//当通过 call 调用 Object.prototype.toString 时，JavaScript 会自动将基本类型转换为对应的包装对象（如 String 对象）
Object.prototype.toString.call('name') // 类型为
Object.prototype.toString.call(new String('name')) // [object String] 
 
console.log(Object.prototype.toString.call('name') === Object.prototype.toString.call(new String('name'))) // true 因为类型相同，所以相等

typeof 'name' // string typeof 只能判断基本数据类型，不能判断对象类型