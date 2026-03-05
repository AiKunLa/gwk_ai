function QucikSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return arr
    let pivot = arr[left]
    let i = left
    let j = right
    while (i < j) {
        while (i < j && arr[j] > pivot) j--
        while (i < j && arr[i] <= pivot) i++
        [arr[i], arr[j]] = [arr[j], arr[i]]
        if (i === j) {
            arr[i] = pivot
        }
    }
    QucikSort(arr, left, i - 1)
    QucikSort(arr, i + 1, right)
    return arr
}