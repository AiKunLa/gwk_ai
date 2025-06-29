function addObserver() {
  // 类数组元素
  const eles = document.querySelectorAll("img[data-original][lazyload]");
  console.log(eles);
  eles.forEach((ele) => {
    console.log(ele);
  });

  // 展开运算符
  const eles2 = [...eles];
  console.log(eles2);

  const elesArr = Array.from(eles);
  console.log(elesArr);

  // 类数组方法
  Array.prototype.map.call(eles, (ele) => {
    console.log(ele);
  });
}

// arguments 类数组
function add() {
  let total = 0;
  arguments.forEach((item) => {
    total += item;
  })
  return total;
}
console.log(add(1, 2, 3));
