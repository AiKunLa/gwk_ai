const flatten = (arr) =>
  arr.reduce(
    (acc, cur) => acc.contact(Array.isArray(cur) ? flatten(cur) : cur),
    [] // 初值
  );
