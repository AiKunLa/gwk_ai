let arr1 = {
  user: {
    name: "张三",
    age: 18,
  },
  f1: function () {
    console.log("hello world");
  },
};

let arr2 = JSON.parse(JSON.stringify(arr1));
console.log(arr2);

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

function clone(source) {
  // 若为基本数据类型
  if (typeof source !== "object" || source === null) {
    return source;
  }
  const newObj = Array.isArray(source) ? [] : {};

  for (const key in source) {
    // 递归当前数据，若是简单数据类型则直接返回，若不是遍历该对象
    newObj[key] = clone(source[key]);
  }
  return newObj;
}
const newObj = clone(target);
console.log(newObj);
