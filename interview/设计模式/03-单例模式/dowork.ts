/**
 * > 实现Storage，使得该对象为单例，基于 localStorage 进行封装。实现方法 setItem(key,value) 和 getItem(key)。
 */

class StorageLocal {

    private static instance: StorageLocal

    private constructor() { }

    static getInstance(): StorageLocal {
        if (!StorageLocal.instance) {
            StorageLocal.instance = new StorageLocal()
        }
        return StorageLocal.instance
    }

    getItem(key: string): string | null {
        return localStorage.getItem(key)
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value)
    }
}