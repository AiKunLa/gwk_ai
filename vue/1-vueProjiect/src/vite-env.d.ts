/// <reference types="vite/client" />
// 声明一个通配符模块，匹配所有以.vue结尾的文件
declare module '*.vue' {
  // 从vue包中导入DefineComponent类型
  import { DefineComponent } from 'vue'
  // 定义组件的类型为DefineComponent，泛型参数分别表示：
  // - 第一个{}：组件的Props类型
  // - 第二个{}：组件的Emits类型  
  // - any：组件的实例类型
  const component: DefineComponent<{}, {}, any>
  // 导出组件作为默认导出
  export default component
}
