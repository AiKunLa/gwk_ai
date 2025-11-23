function flatten(arr) {
  const stack = [...arr];
  const res = [];
  while (stack.length) {
    const item = stack.pop();
    // 若是数组则入栈 若不是则放入结果集中
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      res.push(item);
    }
  }
  return res.reverse();
}

function flatten2(arr) {
  const stack = [...arr];
  const result = [];
  while (stack.length !== 0) {
    const pop = stack.pop();
    if (!Array.isArray(pop)) {
      result.push(pop);
    } else {
      stack.push(...pop);
    }
  }
  return result.reverse();
}
