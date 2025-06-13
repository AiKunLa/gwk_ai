function add(a, b, c) {
  console.log(arguments); //this指向函数最后调用的对象
  console.log(Object.prototype.toString.call(arguments));
  let result = 0;
  for (let i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
    result += arguments[i];
  }

  const arr = Array.from(arguments)
  console.log(Object.prototype.toString.call(arr))

  console.log(result);
  return a + b + c;
}
add(1, 2, 3);
console.log(add.length); // 为什么会有add.length
