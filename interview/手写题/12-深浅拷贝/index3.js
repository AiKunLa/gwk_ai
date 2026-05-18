function demo(o) {
    return Object.create(o)
}

function create(o) {
    return Object.setPrototypeOf({}, o)
}