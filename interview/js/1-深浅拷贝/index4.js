const s = Symbol("id"); // 它是一个独一无二的

const source = {
  [s]: "123",
  name: "张三",
  age: 18,
};

const target = [];
Object.assign(target, source);
console.log(target);
