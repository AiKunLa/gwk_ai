const sym = Symbol("food"); // label 标记独一无二的值 增强对象的隐私性

const sym2 =  Symbol();
console.log(typeof sym2); // symbol
console.log(sym === sym2); // false (symbols are unique
// symbol可以用于对象的key
// 使用Symbol 构造函数实例化一个标记为id的唯一值ID
const ID = Symbol("id"); // label 标记独一无二的值
const sName = "name";
const person = {
  // [] 表示的是一个对象的key 是一个变量
  // 如果我们要取修改别人代码中的对象的key，不用取修改所有person对象中的key，而是取修改ID的值，这样就可以修改所有person对象中ID的值
  [ID]: 5265, // 这里的ID 是一个变量 不是字符串 所以不能使用引号,表示取到ID的值作为key，由于是用来symbol 所以这里的key是唯一的，不会被覆盖
  [sName]: "zhangsan",
};

console.log(person[sName], person[ID]); // 5265 这里的ID 是一个变量 不是字符串 所以不能使用引号,表示取到ID的值作为key，由于是用来symbol 所以这里的key是唯一的，不会被覆盖

for (const key in person) {
  console.log(key,person[key]); // name 这里的ID 是一个变量 不是字符串 所以不能使用引号,表示取到ID的值作为key，由于是用来symbol 所以这里的key是唯一的，不会被覆盖
}


