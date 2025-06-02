// 枚举类型 表示一组常量 常量的值是唯一的 不能被修改
const STATUS = {
    READY: Symbol("ready"), // 唯一的被标记
    RUNNING: Symbol("running"),
    DONE: Symbol("done"),
}

let status = STATUS.READY; // 初始状态为READY
