const start = () => {
    let count = 0;
    setInterval(() => {
        postMessage({ type: 'count', count: count++ })
    }, 2000)
}

self.addEventListener('message', (e) => {
    console.log("Recieve Master message: ", e.data)
    start()
})