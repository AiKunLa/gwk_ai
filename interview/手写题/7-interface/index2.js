function myInstanceof(left, right) {
    let proto = Object.getPrototypeOf(left)
    let res = right.prototype
    while (proto) {
        if (proto === res) {
            return true
        }
        proto = proto.getPrototypeOf(proto)
    }
    return false
}