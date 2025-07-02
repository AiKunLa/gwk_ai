Number("123"); // 123
Number("123a"); // NaN
Number(false); // 0

parseInt("123a"); // 123
parseInt("123.45"); // 123

parseFloat("123.45"); // 123.45
console.log(parseFloat("123.45a")); // 123.45

console.log(+123); // 123
console.log(+'123') // 123
console.log(-'123') // -123
console.log(-'152s') // NaN
