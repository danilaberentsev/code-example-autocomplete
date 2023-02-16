import { useEffect, useRef } from 'react';

export function useEffectOnUpdate(callback: () => void) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      callback();
    }
  }, [callback]);
}
