# Ajax

## 早期接口请求对象xhr
```js
        // xhr es5的技术
        const xhr = new XMLHttpRequest();

        // 打开一个数据传输的通道
        xhr.open('GET','https://api.github.com/users/AiKuLa/repos')

        // 发生请求
        xhr.send()

        // 监听数据的变化 这是es6之前的对象 在es6之前没有Promise 所以用不了then
        // 事件监听 回调函数
        xhr.onreadystatechange = function(){
            console.log(xhr.readyState)
            if(xhr.readyState === 4){
                console.log(xhr.responseText)
            }
        }
```
## 状态码 1-4
- 1 (OPENED) ：已调用 open() 方法，建立了与服务器的连接，但尚未发送请求。此时可以设置请求头或准备发送数据。
- 2 (HEADERS_RECEIVED) ：服务器已接收请求并响应了状态行和响应头，但响应体尚未开始接收。可通过 getResponseHeader() 获取响应头信息。
- 3 (LOADING) ：服务器正在传输响应体数据， responseText 属性已包含部分数据。此状态可能会多次触发（取决于数据传输分块）。
- 4 (DONE) ：请求完成，响应数据已全部接收(接口响应的内容到达了)。此时可通过 status 属性判断请求成功与否（如200表示成功），并处理 responseText 或 responseXML 。


## 使用promis 封装一个fetch
- 1. 理解xhr
- 2. 理解promise