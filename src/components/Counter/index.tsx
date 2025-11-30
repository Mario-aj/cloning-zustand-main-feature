import { useCountStore } from "../../store/countStore";

export const Counter = () => {
  const { count, increment, decrement } = useCountStore();

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={increment}>Increment</button>
      <span>Count: {count}</span>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
