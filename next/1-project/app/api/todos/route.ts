import { NextResponse } from "next/server"; // api server

// 声明一个接口类型
interface Todo {
    id:number;
    text:string;
    completed:boolean
}

// 声明一个
let todos:Todo[] = [
    {
        id:1,
        text:'In my dream',
        completed:false
    },
    {
        id:3,
        text:'',
        completed:false
    },
    {
        id:2,
        text:'Take my hand',
        completed:false
    }
];

// RestFul 一切皆资源，通过RestFul定义后端资源暴露方式。
// 通过指定的方法去对资源进行操作
export async function GET() {
    return NextResponse.json(todos)
}

export async function POST(request:Request) {
    // 获取请求体中的内容
    const data = await request.json()
    // 核心的数据进行限制类型，定义函数接收和返回的数据类型
    const newTodo:Todo = {
        id: + Date.now(),
        text:data.text,
        // ts除了强类型外，还有代码提示，这样写起来更快
        completed:false
    }
    todos.push(newTodo)
    return NextResponse.json(newTodo)
}