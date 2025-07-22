import { useCounterStore } from "@/store/count";

const Counter = () => {
  const { count, increment, discrement } = useCounterStore();
  return (
    <div>
      <h2>Counter {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={discrement}>-</button>
    </div>
  );
};

export default Counter;
