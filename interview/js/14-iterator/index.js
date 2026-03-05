

const myArr = [1, 2, 3]
const map2 = new Map()
map2.set('a', 1)
map2.set('b', 2)

console.log(typeof myArr[Symbol.iterator]) // "function"
console.log(typeof map2[Symbol.iterator]) // "function"

const arrIter2 = myArr[Symbol.iterator]() // 获取数组迭代器：加()表示调用该函数，返回真正的迭代器对象
console.log(arrIter2.next()) // { value: 1, done: false }

for (const item of map2) {
    console.log(item)
}