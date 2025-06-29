const myAjax = async function (url) {
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
};
