/**
 * JavaScript 内存泄漏示例
 *
 * 常见的内存泄漏场景：
 * 1. 全局变量
 * 2. 闭包
 * 3. 定时器未清理
 * 4. 事件监听器未移除
 * 5. DOM 引用
 * 6. Map/Set 持续增长
 */

// 检测运行环境
const isBrowser = typeof window !== 'undefined'
const globalObj = isBrowser ? window : global

console.log('=== JavaScript 内存泄漏示例 ===\n')

// ============================================
// 场景 1: 全局变量意外创建
// ============================================
function leakGlobal() {
    // 漏掉了 var/let/const，意外创建全局变量
    leakGlobalData = '我是泄漏的数据'  // 挂在 window/global 上
}

leakGlobal()
console.log('场景 1: 全局变量泄漏')
console.log('leakGlobalData:', leakGlobalData)


// ============================================
// 场景 2: 闭包导致的内存泄漏
// ============================================
function createLeakClosure() {
    const largeData = new Array(100000).fill('泄漏的数据')

    return function() {
        console.log('闭包引用了 largeData')
        return largeData.length
    }
}

const leakyClosure = createLeakClosure()
console.log('\n场景 2: 闭包泄漏')
console.log('调用 leakyClosure():', leakyClosure())


// ============================================
// 场景 3: 定时器未清理
// ============================================
function createIntervalLeak() {
    const largeData = new Array(100000).fill('interval 泄漏')

    // 定时器一直引用 largeData，但从不清理
    setInterval(() => {
        console.log('定时器运行中...', largeData.length)
    }, 1000)
}

console.log('\n场景 3: 定时器泄漏 (定时器已创建)')
createIntervalLeak()


// ============================================
// 场景 4: Map/Set 的意外引用
// ============================================
const leakyMap = new Map()

function addToLeakyMap() {
    const largeObj = { data: new Array(100000).fill('map 泄漏') }
    leakyMap.set('key', largeObj)
}

console.log('\n场景 4: Map 泄漏')
addToLeakyMap()
console.log('Map size:', leakyMap.size)


// ============================================
// 场景 5: 数组持续增长
// ============================================
const leakyArray = []

function addToArray() {
    const largeObj = new Array(10000).fill('array 泄漏')
    leakyArray.push(largeObj)
}

console.log('\n场景 5: 数组持续增长')
addToArray()
console.log('Array length:', leakyArray.length)


// ============================================
// 场景 6: DOM 引用泄漏 (仅浏览器)
// ============================================
if (isBrowser) {
    const domReferences = []

    function createDOMLeak() {
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div')
            div.textContent = `div ${i}`
            document.body.appendChild(div)
            domReferences.push(div)  // 一直保存引用
        }
    }

    console.log('\n场景 6: DOM 引用泄漏')
    createDOMLeak()
    console.log('DOM 引用数量:', domReferences.length)
}


// ============================================
// 场景 7: 事件监听器泄漏 (仅浏览器)
// ============================================
if (isBrowser) {
    const eventHandlers = []

    function createEventLeak() {
        const largeData = new Array(50000).fill('event 泄漏')

        const handler = function() {
            console.log('点击事件', largeData.length)
        }

        document.addEventListener('click', handler)
        eventHandlers.push({ handler, largeData })
    }

    console.log('\n场景 7: 事件监听器泄漏 (点击页面触发)')
    createEventLeak()
    console.log('事件监听器数量:', eventHandlers.length)
}


// ============================================
// 如何检测内存泄漏
// ============================================
console.log('\n\n=== 内存泄漏检测方法 ===')
console.log('1. Chrome DevTools - Performance 标签页')
console.log('2. Chrome DevTools - Memory 标签页 - Heap Snapshot')
console.log('3. performance.memory (仅 Chrome)')

if (isBrowser && performance.memory) {
    console.log('\n当前内存使用:')
    console.log('JS Heap:', (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2), 'MB')
}

console.log('\n=== 运行结束 ===')
