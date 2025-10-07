// never表示永远不存在的值的类型
// never表示永远无法到达的终点
function err(message:string):never {
    throw new Error(message)
}

err('error')



// 返回never的函数必须存在无法达到的终点
function fn():never {
    return err('error')
}

fn()

type ButtonType = 'primary' | 'secondary' | 'danger'

function getButtonColor(type:ButtonType):string {
    switch(type) {
        case 'primary':
            return 'blue'
        case 'secondary':
            return 'green'
        case 'danger':
            return 'red'
        default:
            // 这里的意思是利用 TypeScript 的类型检查，确保 type 已经穷举了所有 ButtonType 的可能性。
            // 如果 type 不是 'primary' | 'secondary' | 'danger' 之一，赋值给 never 类型会报错，提示有未处理的情况。
            const exhaustiveCheck: never = type
            return exhaustiveCheck
    }
}