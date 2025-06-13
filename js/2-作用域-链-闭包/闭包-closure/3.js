function add(...args) {
  console.log(args);
  // rest运算符 收集作为一个数组
  return (...newArgs) => {
    console.log([...args, ...newArgs]);
  };
}
add(1, 2, 3)(4);

