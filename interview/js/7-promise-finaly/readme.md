# finally 了解多少

    Promise.prototype.finally 是es2018引入的api 用于在Promise成功或失败后都执行一次回调
    他不会改变原有的状态值，只做收尾工作。他的返回值往往被忽略，但若干回调错误会覆盖原有状态。
    - loading 状态处理相比then catch更加简洁，语义化
    ```js
        showLoading()
        fetchData().then(render).catch(showError).finally(hideLoading)
    ```
