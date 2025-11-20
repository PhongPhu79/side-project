"use client";

import { useEffect, useRef } from "react";

type Options = {
  enabled?: boolean;
  onLoadMore: () => void;
};

/**
 * Trả về ref để gắn vào "sentinel" dưới cuối grid.
 * Khi scroll tới sentinel -> gọi onLoadMore().
 */
export function useInfiniteScroll({ enabled = true, onLoadMore }: Options) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, onLoadMore]);

  return ref;
}
