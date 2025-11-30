import { useCountStore } from "../../store/countStore";

export const Counter = () => {
  const { count } = useCountStore();

  return <span>Count: {count}</span>;
};
