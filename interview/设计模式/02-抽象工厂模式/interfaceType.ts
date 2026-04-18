
// 抽象产品
interface OS {
    name: string
}

interface Hardware {
    name: string
}

// 具体产品 - 苹果系
class AppleOS implements OS {
    name = "iOS"
}

class AppleChip implements Hardware {
    name = "A系列芯片"
}

// 具体产品 - Android系
class AndroidOS implements OS {
    name = "Android"
}

class QualcommChip implements Hardware {
    name = "骁龙芯片"
}

class MediatekChip implements Hardware {
    name = "联发科芯片"
}

// 抽象工厂
interface MobilePhoneFactory {
    createOS(): OS
    createHardware(): Hardware
}

// 具体工厂 - 苹果工厂
class AppleFactory implements MobilePhoneFactory {
    createOS(): OS {
        return new AppleOS()
    }
    createHardware(): Hardware {
        return new AppleChip()
    }
}

// 具体工厂 - 高通工厂
class QualcommFactory implements MobilePhoneFactory {
    createOS(): OS {
        return new AndroidOS()
    }
    createHardware(): Hardware {
        return new QualcommChip()
    }
}

// 具体工厂 - 山寨工厂（联发科方案）
class FakeStarFactory implements MobilePhoneFactory {
    createOS(): OS {
        return new AndroidOS()
    }
    createHardware(): Hardware {
        return new MediatekChip()
    }
}

// 使用示例
const appleFactory = new AppleFactory()
const qualcommFactory = new QualcommFactory()
const fakeStarFactory = new FakeStarFactory()

const phone1 = appleFactory.createOS()
const phone2 = qualcommFactory.createOS()
const phone3 = fakeStarFactory.createOS()

console.log(phone1.name) // iOS
console.log(phone2.name) // Android
console.log(phone3.name) // Android

