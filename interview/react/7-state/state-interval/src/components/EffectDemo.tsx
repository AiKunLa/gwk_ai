import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react"

// Props 类型定义（如果需要接收 props）
interface EffectDemoProps {
  initialCount?: number;
  onCountChange?: (count: number) => void;
}

// 配置对象类型
interface Config {
  userId: string;
  timeout: number;
}

// 测试函数类型
type TestFunction = () => void;

const EffectDemo: React.FC<EffectDemoProps> = ({ initialCount = 0, onCountChange }) => {
  // State 类型定义
  const [count, setCount]: [number, Dispatch<SetStateAction<number>>] = useState<number>(initialCount)

  // 函数类型定义
  const testFn: TestFunction = () => {
    console.log('function')
  }

  useEffect(() => {
    console.log('Array is []')
  }, [])

  useEffect(() => {
    console.log("Array is undefined")
  })

  useEffect(() => {
    console.log('Arrar is [count]')
    // 修复：pre++ 返回原始值，应该用 pre + 1
    setCount((pre: number): number => pre + 1)
  }, [count])

  useEffect(() => {
    console.log('Arrar is [testFn]')
  }, [testFn])

  // useMemo 返回值需要类型推断或显式指定
  const config: Config = useMemo(() => ({
    userId: 'userId',
    timeout: 5000
  }), [count])

  useEffect(() => {
    console.log('Effect triggered! Fetching data...', config)
  }, [config])

  // 回调函数
  useEffect(() => {
    if (onCountChange) {
      onCountChange(count)
    }
  }, [count, onCountChange])

  return (
    <>
      <h1>EffectDemo</h1>
      <p>Count: {count}</p>
    </>
  )
}

export default EffectDemo