"use client";

import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toggleCompareAction } from "@/features/compare/actions";
import { CompareIcon } from "@/features/compare/ui/CompareIcon";

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
  const iconSize = size === "sm" ? 16 : 20;

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
      <CompareIcon
        size={iconSize}
        className={`shrink-0 ${iconClassName ?? "text-gray-700"}`}
      />
    </button>
  );
}
