export interface Person {
    name: string
    age: number
    userId: string
    subject: string
    worker: string[]
}

export interface WorkStrategy<T> {
    sWorker: string
}

const strategies: Record<string, string[]> = {
    teacher: ['批改作业', '授课'],
    doctor: ['治病', '手术'],
    engineer: ['写代码', 'CodeReview'],
    farmer: ['耕种', '收割'],

}

export class User implements Person {
    name: string
    age: number
    userId: string
    subject: string
    worker: string[]

    constructor(name: string, age: number, userId: string, subject: string, worker: string[]) {
        this.name = name
        this.age = age
        this.userId = userId
        this.subject = subject
        this.worker = worker
    }
}


export class UserFactory {
    static create(name: string, age: number, userId: string, subject: string) {
        const worker = strategies[subject.toLowerCase()] || []
        return new User(name, age, userId, subject, worker)
    }
}