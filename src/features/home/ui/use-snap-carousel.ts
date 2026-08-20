"use client";

import { useCallback, useRef, useState } from "react";

/** Horizontal snap pages driven by the scroller’s client width. */
export function useSnapCarousel(pageCount: number) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lastIndex = Math.max(pageCount - 1, 0);
  const [activePage, setActivePage] = useState(0);

  const scrollToPage = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el) return;
      const page = Math.max(0, Math.min(index, lastIndex));
      el.scrollTo({ left: page * el.clientWidth, behavior: "smooth" });
      setActivePage(page);
    },
    [lastIndex],
  );

  const onScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const width = el.clientWidth || 1;
    const page = Math.round(el.scrollLeft / width);
    setActivePage(Math.max(0, Math.min(page, lastIndex)));
  }, [lastIndex]);

  return {
    scrollerRef,
    activePage,
    scrollToPage,
    onScroll,
    canScrollPrev: activePage > 0,
    canScrollNext: activePage < lastIndex,
  };
}
