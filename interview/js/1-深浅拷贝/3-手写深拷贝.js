// 使用WeakMap
function clone(source, map = new WeakMap()) { 
  // 若是基本数据类型或函数 则直接返回
  if (typeof source !== "object" || source === null) {
    return source;
  }
  // map是用来存储已经拷贝过的对象的
  // 若map中已经存在该对象，则直接返回
  if (map.has(source)) {
    return map.get(source);
  }

  // 若是引用数据类型 则创建一个新的对象并将其递归复制到新对象中
  const newObj = Array.isArray(source) ? [] : {};

  // 若map中不存在该对象，则将其添加到map中
  map.set(source, newObj);

  for (const key in source) {
    newObj[key] = clone(source[key], map);
  }
  return newObj;
}

// 手写深拷贝
const target = {
  field1: 1,
  field2: undefined,
  field3: "hxt",
  field4: {
    child: "child",
    child2: {
      child2: "child2",
    },
  },
};
// 循环引用 会导致栈溢出
target.target = target;

console.log(clone(target));
