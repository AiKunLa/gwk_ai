function deepCopy(obj, visited = new WeakMap()) {
  // weakMap用于处理循环引用的问题
  // 1.处理非对象和非函数类型
  if (obj === null || typeof obj !== "object") return obj;

  if (obj instanceof Date) return new Date(obj);

  if (obj instanceof RegExp) return new RegExp(obj);

  // 2.处理Map Set 数组
  if (obj instanceof Map) {
    const newMap = new Map();
    visited.set(obj, newMap);
    for (const [key, value] of obj) {
      newMap.set(deepCopy(key, visited), deepCopy(value, visited));
    }
    return newMap;
  }

  if (obj instanceof Set) {
    const newSet = new Set();
    visited.set(obj, newSet);
    for (const value of obj) {
      newSet.add(deepCopy(value, visited));
    }
    return newSet;
  }

  // 若weakMap中已经存在这个对象，则代表存在循环引用
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // 创建一个新对象
  const copyObj = Object.create(Object.getPrototypeOf(obj));
  visited(obj, copyObj);

  for (const key of Object.getOwnPropertyNames(obj)) {
    if (key === "counstruce") continue;
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc && (desc.writable || desc.get || desc.set)) {
      copyObj[key] = deepCopy(obj[key], visited);
    }
  }

  return copyObj;
}
