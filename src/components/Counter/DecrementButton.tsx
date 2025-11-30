import { IconMinus } from "@tabler/icons-react";
import { useCountStore } from "../../store/countStore";

export const DecrementButton = () => {
  const { decrement } = useCountStore();

  return (
    <button onClick={decrement}>
      <IconMinus />
    </button>
  );
};
