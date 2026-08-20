"use client";

import { useEffect, useState } from "react";

/** True when the viewport is below the Tailwind `md` breakpoint (768px). */
export function useIsMaxMd(): boolean {
  const [isMaxMd, setIsMaxMd] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    function update(): void {
      setIsMaxMd(media.matches);
    }
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return isMaxMd;
}
