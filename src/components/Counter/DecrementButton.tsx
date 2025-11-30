import { IconMinus } from "@tabler/icons-react";
import { useCountStore } from "../../store/countStore";

export const DecrementButton = () => {
  const decrement = useCountStore((state) => state.decrement);

  return (
    <button onClick={decrement}>
      <IconMinus />
    </button>
  );
};
