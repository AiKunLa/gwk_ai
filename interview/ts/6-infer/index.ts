// infer 用于在条件类型中推断类型变量，它允许我们在类型层面上提取类型信息。下面是一些使用 infer 的示例：
// 比如将Promise<>中的类型提取出来
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 使用 infer 提取函数参数类型

type User = { id: number, name: string }
type test = UnwrapPromise<Promise<User>> // User

// 还可以使用 infer 提取函数参数类型
type FunctionParameters<T> = T extends (...args: infer P) => any ? P : never

type FnT = (a: number, b: string) => void
type Parms = FunctionParameters<FnT> // [number, string]

// infer 还可以用于提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : T
type Arr = number[]
type Elem = ElementType<Arr> // number