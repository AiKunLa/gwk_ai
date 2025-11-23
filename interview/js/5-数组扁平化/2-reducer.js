const flatten = (arr) =>
  arr.reduce(
    (acc, cur) => acc.contact(Array.isArray(cur) ? flatten(cur) : cur),
    [] // 初值
  );

const flatten2 = (arr) =>
  arr.reduce((curr, next) =>
    curr.contact(Array.isArray(next) ? flatten(next) : next)
  );
