# Form 表单组件设计文档

## 目录结构

```
src/components/Form/
├── types.ts       # 类型定义
├── useForm.ts     # useForm hook + Form 组件 + Context
└── FormItem.tsx   # FormItem 组件
```

## types.ts — 三个接口

```typescript
// FormItem 的 props
interface FormItemProps {
  name: string
  label?: string
  children: React.ReactNode
}

// Form 的 props
interface FormProps {
  initialValues?: Record<string, unknown>
  onFinish?: (values: Record<string, unknown>) => void
  children: React.ReactNode
}

// Form 实例（useForm 返回的对象）
interface FormInstance {
  getFieldValue: (name: string) => unknown
  setFieldValue: (name: string, value: unknown) => void
  getFieldsValue: () => Record<string, unknown>
  resetFields: () => void
}
```

## useForm.ts — 两部分

### useForm hook

```typescript
// 返回表单实例
function useForm() {
  const [values, setValues] = useState({})

  return {
    getFieldValue: (name) => values[name],
    setFieldValue: (name, value) => setValues(prev => ({ ...prev, [name]: value })),
    getFieldsValue: () => ({ ...values }),
    resetFields: () => setValues({}),
  }
}
```

### Form 组件

- 用 Context 把 useForm 返回的实例提供给子组件
- 包裹 `<form onSubmit={...}>` 触发 onFinish

## FormItem.tsx

- 从 Context 拿到表单实例
- 注册到 Form（mount 时注册，unmount 时注销）
- 用 `cloneElement` 给子组件注入 `value` 和 `onChange`

## 使用方式

```tsx
const [form] = useForm()

<Form form={form} onFinish={(v) => console.log(v)}>
  <FormItem name="username" label="用户名">
    <input />
  </FormItem>
</Form>
```
