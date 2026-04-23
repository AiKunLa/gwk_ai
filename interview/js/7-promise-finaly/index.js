async function myTest() {
    return 1
}

function t2() {
    return 1 + 1
}

async function t() {
    const r1 = await myTest()
    console.log(r1)
    const r2 = await t2()
    console.log(r2)
}

t()