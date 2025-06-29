// 封装xhr
const getJson = async function (url) {
  // 返回一个Promise 就和 fetch 一样
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 调用resolve表示Promis异步任务执行完成
          // resolve 会将异步任务的结果返回
          resolve(JSON.parse(xhr.responseText));
        } else {
          // reject 会将异步任务执行失败的原因返回
          reject(JSON.parse(xhr.responseText));
        }
      }
    };
  });
  // 异步的
};

const result = await getJson("https://api.github.com/users/AiKuLa/repos");
