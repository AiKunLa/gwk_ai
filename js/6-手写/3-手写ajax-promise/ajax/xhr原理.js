// xhr es5的技术
const xhr = new XMLHttpRequest();

// 打开一个数据传输的通道
xhr.open("GET", "https://api.github.com/users/AiKuLa/repos");

// 发生请求
xhr.send();

// 监听数据的变化 这是es6之前的对象 在es6之前没有Promise 所以用不了then
// 事件监听 回调函数 html 是 XML的一种格式
xhr.onreadystatechange = function () {
  console.log(xhr.readyState);
  if (xhr.readyState === 4) {
    console.log(xhr.responseText);
    // 转为json对象
    const data = JSON.parse(xhr.responseText);
    console.log(data);
  }
};
