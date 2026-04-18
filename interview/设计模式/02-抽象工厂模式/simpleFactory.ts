// 抽象产品
interface OS {
    name: string
}

interface Hardware {
    name: string
}

// 具体产品
class AppleOS implements OS {
    name = "iOS"
}

class AppleChip implements Hardware {
    name = "A系列芯片"
}

class AndroidOS implements OS {
    name = "Android"
}

class QualcommChip implements Hardware {
    name = "骁龙芯片"
}

class MediatekChip implements Hardware {
    name = "联发科芯片"
}

// 手机产品（组合具体部件）
class Phone {
    constructor(
        public os: OS,
        public hardware: Hardware
    ) {}

    describe() {
        console.log(`手机配置: ${this.os.name} + ${this.hardware.name}`)
    }
}

// 简单工厂 + 注册表（避免类爆炸）
class PhoneFactoryRegistry {
    private static factories: Record<string, () => Phone> = {}

    static register(type: string, factory: () => Phone) {
        this.factories[type] = factory
    }

    static create(type: string): Phone {
        const factory = this.factories[type]
        if (!factory) {
            throw new Error(`Unknown phone type: ${type}`)
        }
        return factory()
    }
}



// 注册具体工厂（无需修改核心代码）
PhoneFactoryRegistry.register('apple', () => {
    return new Phone(new AppleOS(), new AppleChip())
})

PhoneFactoryRegistry.register('high-end', () => {
    return new Phone(new AndroidOS(), new QualcommChip())
})

PhoneFactoryRegistry.register('budget', () => {
    return new Phone(new AndroidOS(), new MediatekChip())
})

// 使用示例
const phone1 = PhoneFactoryRegistry.create('apple')
const phone2 = PhoneFactoryRegistry.create('high-end')
const phone3 = PhoneFactoryRegistry.create('budget')

phone1.describe() // 手机配置: iOS + A系列芯片
phone2.describe() // 手机配置: Android + 骁龙芯片
phone3.describe() // 手机配置: Android + 联发科芯片
