# xss 跨站脚本攻击

xss是攻击者把恶意脚本注入道页面中，让浏览器执行

- 存储型 攻击者把恶意脚本存放道数据库中，当用户访问页面时，脚本会被浏览器执行。
    拿到cookie 发送到攻击者的网站，所以才有 Cookie httpOnly 来防止XSS

    如何防止xss， 不能相信用户的输入，我没可以将用户的输入进行转译
    转译： 将 <script>  标签转译为 &lt;script&gt; ,html文本化

- DOM型 立即执行

    ```html
            <input type="text" id="nameInput">
            <div id="box"></div>
            <script>
                const nameInput = document.getElementById('nameInput')
                const box = document.getElementById('box')
                nameInput.addEventListener('input',() => {
                    box.innerHTML = nameInput.value
                    box.textContent = nameInput.value
                })
    </script>
    ```

    当通过innerHTml插入文本到页面中，当文本是html或脚本的时候，会立即执行。这时候可以通过textContent来
    阻止，textContent只能接收文本。

- 反射型
    恶意脚本不会被存储在目标服务器上，而是通过 URL 参数等方式“反射”回用户的浏览器并执行
    攻击者构造一个恶意的URL ：https://example.com/search?q=<script>alert('XSS')</script>
    用户点击该链接
    Web 应用未对输入参数（如 q）进行充分过滤或转义，直接将参数值嵌入 HTML 响应中返回给用户。
    用户的浏览器接收到响应后，解析并执行其中的恶意脚本
    攻击后果：窃取Cookie、重定向到钓鱼网站、劫持用户会话、

    用户访问：https://example.com/search.php?q=<script>alert('XSS')</script>
    服务器直接将 $_GET['q'] 输出到 HTML 中，未做任何转义。
    浏览器解析后执行

    解决方法
        使用textContent代替innerHtml进行输入验证
        过滤或限制特殊字符< > &lt; &gt;

        在服务器端对动态内容进行html编码 ：将用户提供的不可信数据在输出到 HTML 页面前，转换为无害的文本形式，防止浏览器将其解析为 HTML 或 JavaScript 代码。
        encodeURIComponent("/abc?keyword=<script></script>")
        解析为：'%2Fabc%3Fkeyword%3D%3Cscript%3E%3C%2Fscript%3E'

        前端转译DOMPurify 过滤危险的HTML标签和属性

- Cookie HttpOnly
    