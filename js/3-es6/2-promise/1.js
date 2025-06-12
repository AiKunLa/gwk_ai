// 读取html中的内容 控制执行流程
const fs = require("fs"); // 引入fs模块 引入js内置的文件模块
const readFilePromise = new Promise((resolve, reject) => {
  fs.readFile("./1.html", (err, data) => {
    console.log(data.toString());
    if (err) {
      console.log(err);
    }
    resolve();
  });
});
readFilePromise.then(() => { // then是一个函数 其执行全在resolve手中，
  console.log("sps");
});
