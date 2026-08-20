import { useCallback, useEffect, useRef, useState } from "react";

// In any list that only shows open work, checking something off would normally
// make the row vanish on the same frame — so you never actually see the box get
// checked, and it's unclear whether the tap registered. This keeps a
// just-checked row in place for a beat: the check lands, the label strikes
// through, then the row fades out on its own.
export const CHECKED_LINGER_MS = 1200;

export function useCheckedLinger(ms = CHECKED_LINGER_MS) {
  const [lingering, setLingering] = useState<Set<string>>(new Set());
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      timers.current.clear();
    },
    [],
  );

  const drop = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setLingering((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Call right after checking something off.
  const hold = useCallback(
    (id: string) => {
      const existing = timers.current.get(id);
      if (existing) clearTimeout(existing);
      setLingering((prev) => new Set(prev).add(id));
      timers.current.set(
        id,
        setTimeout(() => drop(id), ms),
      );
    },
    [drop, ms],
  );

  const isLingering = useCallback((id: string) => lingering.has(id), [lingering]);

  return { hold, drop, isLingering };
}
