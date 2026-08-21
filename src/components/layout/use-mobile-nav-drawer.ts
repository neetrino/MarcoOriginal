"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const DESKTOP_NAV_MQ = "(min-width: 1180px)";

export function useMobileNavDrawer() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const closeMenu = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_NAV_MQ);
    function closeOnDesktop(): void {
      if (media.matches) setOpen(false);
    }
    const frame = requestAnimationFrame(closeOnDesktop);
    media.addEventListener("change", closeOnDesktop);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return { open, pathname, closeMenu, toggleMenu };
}
