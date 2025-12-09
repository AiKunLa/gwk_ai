// 存在的问题：
// 1. this.instance 可能未初始化，第一次调用时为 undefined，而不是 null，导致单例不生效
// 2. getInstance 没有参数初始化，无法传递参数到 constructor
// 3. constructor 并未阻止外部 new Singleton()，不能防止外部实例化
// 4. 只支持最后一次赋值，单例并不严谨

// 正确的写法应如下：
// 1. 使用私有静态属性保存实例
// 2. constructor 内阻止外部 new
// 3. 仅通过 getInstance 获取单例
// 4. 参数只在第一次实例化时有效

class Singleton {
    constructor(name, age) {
        if (Singleton._instance) {
            throw new Error('只能通过Singleton.getInstance()获取实例！');
        }
        this.name = name;
        this.age = age;
        Singleton._instance = this;
    }

    static getInstance(name, age) {
        if (!Singleton._instance) {
            Singleton._instance = new Singleton(name, age);
        }
        return Singleton._instance;
    }
}

const instance1 = Singleton.getInstance()
const instance2 = Singleton.getInstance()

console.log(instance1 === instance2)


const Singleton2 = (()=>{

    let _instance = null

    function createObj(...args){
        return new Object()
    }

    return {
        getInstance : (...args) => {
            if(!_instance){
                _instance = createObj(...args)
            }
            return _instance
        }
    }
})()