const person = {
    name: 'zs',
    age: 18,
    sex: '男'
}
const pToString = JSON.stringify(person)
console.log(pToString) //{"name":"zs","age":18,"sex":"男"}

const pToObject = JSON.parse(pToString)
console.log(typeof pToObject)