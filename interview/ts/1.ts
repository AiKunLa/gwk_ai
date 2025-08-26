let take:any = 'name'
take = 4

function TakeMyHand<T>(arr:T[]):T {
    return arr[0]
}

const arr:string[] = ['1','2','4']

const first = TakeMyHand(arr)


function getFirstElement<T>(arr:T[]):T|undefined {
    return arr.length > 0 ? arr[0] : undefined
}
let var1 = getFirstElement(arr)
