type User = {
    name:string
    age:number
    email:string
    isAdmin:boolean
    address:string
    phone:string
}

type userName = Pick<User, 'name' | 'age'>
type userEmail = Omit<User, 'name' | 'age'>