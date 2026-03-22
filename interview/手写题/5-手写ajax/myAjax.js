/**
 * 实例化：创建一个 XHR 对象。
    配置 (open)：设定请求方法（GET/POST）、URL 以及是否异步。
    监听状态 (onreadystatechange)：这是关键。请求发送后，状态会变化。我们需要监听这个变化，直到它到达“完成”状态。
    发送 (send)：真正发出网络请求。
 */
/**
 * 简易的原生 AJAX 请求封装
 * @param {string} method - 请求方法 (GET, POST 等)
 * @param {string} url - 请求地址
 * @param {function} successCallback - 成功回调
 * @param {function} errorCallback - 失败回调
 * @param {any} data - 发送的数据 (仅用于 POST/PUT 等，GET 时为 null)
 */
function simpleAjax(method, url, successCallback, errorCallback, data = null) {
    // 1. 创建 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();

    // 2. 配置请求 (open)
    // 参数：方法, URL, 是否异步 (true 为异步，推荐始终使用异步)
    xhr.open(method, url, true);

    // 设置请求头 (如果是 POST 发送 JSON 数据，通常需要设置此项)
    if (method === 'POST' && data) {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    }

    // 3. 监听状态变化 (onreadystatechange)
    xhr.onreadystatechange = function () {
        // 核心判断逻辑：
        // readyState === 4: 请求已完成，响应已就绪 (DONE)
        // status >= 200 && status < 300: HTTP 状态码表示成功 (如 200 OK, 201 Created)
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                // 请求成功且数据已获取
                try {
                    // 尝试自动解析 JSON，如果响应不是 JSON 则 fallback 到文本
                    const response = xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText);
                    successCallback(response, xhr.status);
                } catch (e) {
                    // 如果解析失败，直接返回原始文本
                    successCallback(xhr.responseText, xhr.status);
                }
            } else {
                // 请求完成了，但状态码表示失败 (如 404 Not Found, 500 Server Error)
                if (errorCallback) {
                    errorCallback(`Request failed with status: ${xhr.status}`, xhr.status);
                }
            }
        }
        // 注意：readyState 为 0, 1, 2, 3 时我们通常不处理，只关心最终状态 4
    };

    // 处理网络错误 (如断网、DNS 解析失败，这些不会触发 onreadystatechange 中的 status 判断)
    xhr.onerror = function () {
        if (errorCallback) {
            errorCallback('Network error occurred', 0);
        }
    };

    // 4. 发送请求 (send)
    // 如果是 GET 请求，data 通常为 null；如果是 POST，data 需转为字符串
    const body = data && typeof data === 'object' ? JSON.stringify(data) : data;
    xhr.send(body);
}

// --- 使用示例 ---

// 假设有一个测试接口
const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';

simpleAjax(
    'GET',
    apiUrl,
    (data, status) => {
        console.log('✅ 成功获取数据:', data);
        console.log('HTTP 状态码:', status);
        // 这里可以操作 DOM 更新页面
    },
    (error, status) => {
        console.error('❌ 请求失败:', error);
    }
);