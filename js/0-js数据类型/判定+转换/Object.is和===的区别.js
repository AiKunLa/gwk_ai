//Object.is和===的区别

console.log(Object.is(NaN, NaN));
console.log(Object.is(+0, -0));
console.log(Object.is(0, -0));

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
console.log(is(NaN,NaN))
