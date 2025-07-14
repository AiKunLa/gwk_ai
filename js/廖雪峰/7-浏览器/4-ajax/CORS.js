// 简单请求
fetch('https://www.baidu.com/')

// 预检请求
fetch('https://www.baidu.com/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: '张三',
        age: 18
    })
})
