const obj = { a: 1, b: 2 };
const target = new Map();
target.set(obj, 123);
target.set(5, "5");
target.set({}, "555");
target.get(obj);

console.log(target.keys());
console.log(target.values());
console.log(target.has(5));
console.log(target.delete(5));

let obj2 = { name: "实用性" };

const target2 = new WeakMap(); // 弱的 用法于map相同， 对象作为引用的弱和强，当对象作为key时 若对象被回收，那么WeakMap中对应的键值对也会被回收
target2.set(obj2, 123);
obj2 = null;
console.log(target2.get(obj2)) // undefined



