class EventBun {
    constructor() {
        this.listner = []
    }

    /**
     * 监听事件
     */
    on(event, callback) {
        if (!this.listner[event]) this.listner[event] = []
        this.listner[event].push(callback)
        // 返回移除事件监听函数
        return this.off(event, callback)
    }

    /**
     * 移除事件监听
     * @param {*} event 
     * @param {*} callback 
     */
    off(event, callback) {
        if (!this.listner[event]) return
        this.listner[event] = this.listner.filter((e) => e !== callback)
    }

    /**
     * 触发事件
     * @param {} event 
     * @param {*} data 
     */
    emit(event, data) {
        if (!this.listner[event]) return
        return this.listner[event].map((cb) => cb(data))
    }
}