// 在什么场景使用浅拷贝
// 合并用户传入的参数
// 目标对象是{} 对象 合并用户参数和默认参数
// option是用户传入的参数
function createUser(option) {
  const defaults = {
    name: "张三",
    age: 18,
    sex: "男",
  };
  // 合并用户传入的参数
  const newObj = Object.assign({}, defaults, option);
  console.log(newObj);
}
createUser({ name: "/api", age: 19 });
const baseConfig = { api: "/api", timeout: 500 };
const envConfig = { timeout: 1000, debug: true };
const finalConfig = Object.assign({}, baseConfig, envConfig);
console.log(finalConfig);

