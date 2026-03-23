/**
 * 简易版 Promise 封装 AJAX 函数
 * @param {Object} options - 配置项
 * @param {string} options.url - 请求地址
 * @param {string} [options.method='GET'] - 请求方法
 * @param {Object} [options.data] - 请求数据
 * @param {Object} [options.headers] - 自定义请求头
 * @returns {Promise<any>}
 */
function myAjax({ url, method = 'GET', data = null, headers = {} }) {
    return new Promise((resolve, reject) => {
        // 1. 创建 XHR 对象
        const xhr = new XMLHttpRequest();

        // 2. 标准化方法为大写
        const httpMethod = method.toUpperCase();

        // 3. 处理 URL 和数据 (GET 拼接到 URL, POST 放在 body)
        let queryString = '';
        if (data && typeof data === 'object') {
            if (httpMethod === 'GET') {
                // 将对象转换为 query 字符串 ?key=value&key2=value2
                const params = new URLSearchParams();
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        params.append(key, data[key]);
                    }
                }
                queryString = params.toString();
                url += (url.includes('?') ? '&' : '?') + queryString;
                data = null; // GET 请求 body 应为 null
            } else {
                // POST/PUT 等，默认序列化为 JSON
                data = JSON.stringify(data);
                // 如果没有用户自定义 Content-Type，默认设为 application/json
                if (!headers['Content-Type'] && !headers['content-type']) {
                    headers['Content-Type'] = 'application/json;charset=UTF-8';
                }
            }
        }

        // 4. 初始化请求
        xhr.open(httpMethod, url, true);

        // 5. 设置请求头
        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        // 6. 监听状态变化
        xhr.onreadystatechange = function () {
            // readyState 4 表示请求已完成
            if (xhr.readyState === 4) {
                // 判断 HTTP 状态码是否在成功范围 (200-299)
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        // 尝试解析 JSON 响应
                        const response = JSON.parse(xhr.responseText);
                        resolve({
                            data: response,
                            status: xhr.status,
                            headers: xhr.getAllResponseHeaders(),
                        });
                    } catch (e) {
                        // 如果响应不是 JSON，直接返回原始文本
                        resolve({
                            data: xhr.responseText,
                            status: xhr.status,
                            headers: xhr.getAllResponseHeaders(),
                        });
                    }
                } else {
                    // HTTP 错误 (如 404, 500)
                    reject(new Error(`Request failed with status ${xhr.status}: ${xhr.statusText}`));
                }
            }
        };

        // 7. 监听网络错误 (如断网、DNS 解析失败)
        xhr.onerror = function () {
            reject(new Error('Network error occurred'));
        };

        // 8. 发送请求
        xhr.send(data);
    });
}

// --- 使用示例 ---

// 示例 1: GET 请求
// myAjax({
//   url: 'https://api.example.com/users',
//   method: 'GET',
//   data: { page: 1, limit: 10 }
// })
// .then(res => console.log('Users:', res.data))
// .catch(err => console.error('Error:', err));

// 示例 2: POST 请求
// myAjax({
//   url: 'https://api.example.com/login',
//   method: 'POST',
//   data: { username: 'admin', password: '123456' },
//   headers: { 'Authorization': 'Bearer token123' }
// })
// .then(res => console.log('Token:', res.data.token))
// .catch(err => console.error('Login failed:', err));


function AJAX_Promise({ method = 'GET', url, data = null, headers = {} }) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        // method 大写
        // data 转URL，heads补全

        let queryString = ''

        // 若data是对象，且请求方法是GET
        if (data && typeof data === 'object') {
            if (method === 'GET') {
                const params = new URLSearchParams()
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        params.append(key, data[key])
                    }
                }
                queryString = params.toString()
                url += (url.includes('?') ? '&' : '?') + queryString
                data = null
            } else {
                // POST/PUT 等，默认序列化为 JSON
                data = JSON.stringify(data);
                // 如果没有用户自定义 Content-Type，默认设为 application/json
                if (!headers['Content-Type'] && !headers['content-type']) {
                    headers['Content-Type'] = 'application/json;charset=UTF-8';
                }
            }
        }

        xhr.open(method, url, true)

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status <= 400) {
                    try {
                        const response = JSON.parse(xhr.responseText)
                        resolve({

                        })
                    } catch (error) {
                        resolve({

                        })
                    }
                } else {
                    reject('')
                }
            }
        }

        xhr.onerror = function () {

        }

        xhr.send(data)
    })
}