import { IconRefresh } from "@tabler/icons-react";
import { useCountStore } from "../../store/countStore";

export const ResetButton = () => {
  const reset = useCountStore((state) => state.reset);

  return (
    <button onClick={reset}>
      <IconRefresh />
    </button>
  );
};
