function f1() {
  var n = 99;
  nAdd = function () {
    n++;
  };
  function f2() {
    console.log(n);
  }
  return f2;
}
// 上述有几个闭包函数
var test = f1();
test()//99
nAdd()
test()//100
