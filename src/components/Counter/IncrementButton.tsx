import { IconPlus } from "@tabler/icons-react";
import { useCountStore } from "../../store/countStore";

export const IncrementButton = () => {
  const increment = useCountStore((state) => state.increment);

  return (
    <button onClick={increment}>
      <IconPlus />
    </button>
  );
};
