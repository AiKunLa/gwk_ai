// js 是弱类型语言 容易出问题
interface UserDemo {
    name:string
    age:number
}

type UserType = {
    name:string
    age:number
}

const user1:UserDemo = {
    name:'',
    age:55
}