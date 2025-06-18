import { useCallback, useEffect, useRef } from "react";

type Props = {
  delay?: number;
};

const useDebounce = ({ delay = 500 }: Props) => {
  const timer = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const debounce = useCallback(
    (callBack: () => void) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(callBack, delay);
    },
    [delay],
  );
  return { debounce };
};

export default useDebounce;
