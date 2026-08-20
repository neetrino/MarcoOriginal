"use client";

import type { MouseEvent } from "react";
import { Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleCompareAction } from "@/features/compare/actions";

type CompareButtonProps = {
  productId: string;
  initialInCompare: boolean;
  label: string;
  className?: string;
  activeClassName?: string;
  iconClassName?: string;
  size?: "sm" | "md";
};

export function CompareButton({
  productId,
  initialInCompare,
  label,
  className = "",
  activeClassName = "",
  iconClassName,
  size = "md",
}: CompareButtonProps) {
  const router = useRouter();
  const [inCompare, setInCompare] = useState(initialInCompare);
  const [pending, startTransition] = useTransition();
  const iconClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const previous = inCompare;
      setInCompare(!previous);
      const result = await toggleCompareAction(productId);
      if (!result.ok) {
        setInCompare(previous);
        return;
      }
      setInCompare(result.value.inCompare);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
      aria-pressed={inCompare}
      className={`inline-flex items-center justify-center transition disabled:opacity-60 ${
        inCompare && activeClassName ? activeClassName : className
      }`}
    >
      <Scale
        className={`${iconClass} ${iconClassName ?? "text-gray-700"}`}
        aria-hidden
      />
    </button>
  );
}
