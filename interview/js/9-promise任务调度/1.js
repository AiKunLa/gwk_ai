const tasks1 = () => new Promise(resolve => setTimeout(()=>{
    console.log('任务2完成')
    resolve(2)
}, 2000))

const tasks2 = () => new Promise(resolve => setTimeout(()=>{
    console.log('任务3完成')
    resolve(3)
}, 3000))

const tasks3 = () => new Promise(resolve => setTimeout(()=>{
    console.log('任务4完成')
    resolve(4)
}, 4000))


class TaskScheduler {
    constructor(maxConcurrency = 2) {
        this.maxConcurrency = maxConcurrency
        this.runningCount = 0 // 当前正在执行的任务数
        this.taskQueue = [] // 任务队列
    }

    addTask(task) {
        // 为什么要返回 Promise？
        // addTask 需要让调用者知道每个任务什么时候完成，所以返回一个 Promise。
        // 这样用户可以 .then/.catch 拿到每个任务的执行结果。
        return new Promise((resolve, reject) => {
            const run = () => {
                this.runningCount++;
                // 这里调用者传入的 task 本身应该返回一个 Promise
                task()
                    .then(result => {
                        resolve(result); // 任务成功完成，通知 addTask 的调用者
                    })
                    .catch(error => {
                        reject(error);   // 任务失败，通知 addTask 的调用者
                    })
                    .finally(() => {
                        this.runningCount--;
                        this.next();
                    });
            };
            this.taskQueue.push(run);
            this.next();
        });
    }

    next() {
        // 当队列中有，且当前正在执行的数量小于最大限制
        while(this.runningCount < this.maxConcurrency && this.taskQueue.length > 0) {
            const task =this.taskQueue.shift()
            task()
        }
    }
}

const scheduler = new TaskScheduler(2)

scheduler.addTask(tasks1)
scheduler.addTask(tasks2)
scheduler.addTask(tasks3).then(res => {console.log(res)})

scheduler.next()