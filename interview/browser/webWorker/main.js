

if (typeof Worker === 'undefined') {
    console.error('Worker is not defined。请在浏览器环境中通过 HTML 加载运行该示例')
    if (typeof process !== 'undefined' && typeof process.exit === 'function') {
        process.exit(1)
    }
}

const worker = new Worker('./worker.js')

worker.onmessage = (e) => {
    console.log('主线程收到消息:', e.data)
    worker.terminate()
}


// 3. 监听错误
worker.onerror = function (error) {
    console.error('Worker 错误:', error.message);
};




const message = {
    method: 'add',
    data: {
        a: 1,
        b: 2
    }
}

worker.postMessage(message)
