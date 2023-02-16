import { useCallback, useEffect, useRef } from 'react';

export function useOnClickOutside<Element extends HTMLElement>(callback: () => void) {
  const ref = useRef<Element>();

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!ref.current.contains(e.target as HTMLElement)) {
      callback();
    }
  }, [callback]);

  const handleEscapePress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') callback();
  }, [callback]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('keydown', handleEscapePress, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('keydown', handleEscapePress, true);
    };
  }, [handleClickOutside, handleEscapePress]);

  return ref;
}
