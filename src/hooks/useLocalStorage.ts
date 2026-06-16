'use client';

import { useCallback, useEffect, useState } from 'react';

/** SSR-safe localStorage-backed state. Falls back to initialValue when unavailable. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore read/parse errors */
    }
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore quota/availability errors */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
