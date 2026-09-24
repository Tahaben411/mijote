import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored === null ? initialValue : (JSON.parse(stored) as T);
    } catch {
      return initialValue;
    }
  });

  const updateValue = useCallback(
    (nextValue: T) => {
      setValue(nextValue);
      try {
        localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        // Le stockage local peut être indisponible (mode privé, quota, etc.).
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch {
      // Même stratégie de repli que ci-dessus.
    }
  }, [initialValue, key]);

  return [value, updateValue, removeValue] as const;
}
