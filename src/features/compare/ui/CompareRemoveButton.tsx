"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

import { removeCompareAction } from "@/features/compare/actions";

type CompareRemoveButtonProps = {
  productId: string;
  label: string;
};

export function CompareRemoveButton({
  productId,
  label,
}: CompareRemoveButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick(): void {
    startTransition(async () => {
      const result = await removeCompareAction(productId);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-marco-slate shadow-sm transition hover:bg-gray-100 disabled:opacity-60"
    >
      <X className="h-4 w-4" aria-hidden />
    </button>
  );
}
