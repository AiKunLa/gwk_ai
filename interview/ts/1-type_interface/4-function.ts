interface FnObj {
    doit(a:number,b:number):number
    add(a:number,b:number):number
}

const FnIml:FnObj = {
    doit: (a: number, b: number): number => a + b,
    add: (a: number, b: number): number => a + b,
}

type AddType = (a:number,b:number) => number

// 别名
type NumberFirst = number
type StringFirst = string