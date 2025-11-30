import { useCountStore } from "../../store/countStore";

export const Counter = () => {
  const count = useCountStore((state) => state.count);

  return <span>Count: {count}</span>;
};
