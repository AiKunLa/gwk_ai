self.onmessage = (e) => {
  const { method, data } = e.data
  if (method === 'add') {
    const { a, b } = data
    self.postMessage({
      method: 'add',
      data: a + b
    })
    return
  }
  self.postMessage({
    method: 'error',
    data: 'Unknown method'
  })
}
