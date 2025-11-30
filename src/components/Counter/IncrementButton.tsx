import { IconPlus } from "@tabler/icons-react";
import { useCountStore } from "../../store/countStore";

export const IncrementButton = () => {
  const { increment } = useCountStore();

  return (
    <button onClick={increment}>
      <IconPlus />
    </button>
  );
};
