let a = "abc";
let b = new String("abc");
console.log(a == b); //
// js给所有简单数据类型提供都提供了一个包装类，例如String、Number、Boolean、Symbol、Null、Undefined 转换后就可以调用包装类的方法
console.log(a === b); // false 因为类型不同，所以不相等

const reverseString = (str) => str.split("").reverse().join(""); // 反转字符串

const reverseString2 = function (str) {

};
