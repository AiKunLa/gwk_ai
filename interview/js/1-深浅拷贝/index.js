// 有两个容器

const obj = {a:'1',b:'2',c:'3'}
const obj2 = {c:'4',b:'2'}

// 浅拷贝
const result = Object.assign(obj,obj2)
// console.log(result,obj) // {a:'1',b:'2'}
obj.a = '2'

// console.log(result) // {a:'2',b:'2'}


const source = {
    b:{
        name:'zhangsan',
        age:18
    }
}

const result2 = Object.assign(obj,source)
console.log(source)
console.log(result2) // {a:'2',b:{name:'zhangsan',age:18}}