const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn){
    let self = this
    this.state = PENDING
    this.value = null
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []

    function resolve(value){
        if(value instanceof MyPromise){
            return value.then(resolve,reject)
        }
    }

    setTimeout(()=>{
        if(self.state === PENDING){
            self.state = PENDING
            self.value = this.value
            
        }
    })
}