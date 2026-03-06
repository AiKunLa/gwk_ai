interface PageSchema {
    version: string;       // 协议版本
    components: ComponentNode[]; // 根节点列表（支持多根）
    variables?: Record<string, any>; // 全局变量/状态
    methods?: Record<string, FunctionLogic>; // 逻辑编排
}

interface ComponentNode {
    id: string;            // 唯一标识 (UUID)，用于 Diff 和定位
    componentName: string; // 组件名称 (如 'Button', 'Table')
    props: Record<string, any>; // 属性配置 (标题、颜色、数据源绑定)
    children: ComponentNode[];  // 子组件树
    style?: Record<string, any>; // 样式配置
    events?: Record<string, ActionLogic>; // 事件绑定 (onClick -> submitForm)
    hidden?: boolean | string; // 显隐逻辑 (支持表达式)
}