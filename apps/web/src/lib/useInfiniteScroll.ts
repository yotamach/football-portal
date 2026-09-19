"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onLoadMore` once a sentinel element scrolls near the viewport.
 * Attach the returned ref to a marker element placed after the list; render
 * the marker only while `enabled` (i.e. there's more to load) so the
 * observer naturally stops firing once the list is exhausted.
 */
export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callbackRef.current();
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
