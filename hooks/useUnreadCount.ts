import { useEffect, useState } from "react";
import { fetchUnreadCount } from "../lib/messages";

// Lightweight poll for the tab badge — matches the 30s presence poll cadence.
const POLL_MS = 30_000;

export function useUnreadCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const n = await fetchUnreadCount().catch(() => 0);
      if (!cancelled) setCount(n);
    }

    load();
    const interval = setInterval(load, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return count;
}
