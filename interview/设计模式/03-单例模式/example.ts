/**
 * 单例模式：一个类只有一个实例，并提供一个全局访问的接口，例如：reduex / Vuex 全局状态管理提供的Store就是一个全局的访问接口。
 */
class Singleton {
    static #instance: Singleton | null = null
    static #count = 0

    constructor() {
        if (Singleton.#instance) {
            throw new Error("")
        }
    }

    static getInstance() {
        if (!Singleton.#instance) {
            Singleton.#instance = new Singleton()
            console.log("创建实例")
        }
        return Singleton.#instance
    }

}