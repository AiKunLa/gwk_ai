const obj = {
    name: '张三',
    age: 18
}
obj.name = '李四'
console.log(obj.name) // 李四


const pers = obj // 浅拷贝，拷贝的是对象的地址
pers.age = 30
console.log(obj.age) // 30


const person = {
    name: '张三',
    age: 18,
    sex: '男',
    friends: ['李四', '王五', '赵六']
}
const cp = {...person} // 浅拷贝
cp.name = 'LiSi'
console.log(person.name) // 张三
console.log(cp.name) // LiSi
