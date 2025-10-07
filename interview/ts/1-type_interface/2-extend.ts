interface Person {
    name:string
    age:number
}
interface Child extends Person {
    job:string
}

type PersonType = {name:string}
type EmployeeType= PersonType & {job:string}

const p1:EmployeeType = {
    name:'',
    job:''
}