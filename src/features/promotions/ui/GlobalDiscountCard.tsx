"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CircleDollarSign } from "lucide-react";

import {
  formatAdminMessage,
  getAdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import { setGlobalDiscountAction } from "@/features/promotions/application/manage-discounts";
import {
  DISCOUNT_FIELD,
  DISCOUNT_GLOBAL_CARD,
  DISCOUNT_ICON_ROSE,
  DISCOUNT_PRIMARY_BUTTON,
  DISCOUNT_QUICK_BUTTON,
  DISCOUNT_STATUS_ACTIVE,
  DISCOUNT_STATUS_IDLE,
} from "@/features/promotions/ui/discount-admin.classes";
import { parseDiscountPercent } from "@/features/promotions/ui/discount-percent";
import { useSyncedState } from "@/lib/react/sync-state-from-prop";

const QUICK_PERCENTS = [10, 20, 30, 50] as const;

type GlobalDiscountCardProps = {
  locale: string;
  initialPercent: number | null;
};

export function GlobalDiscountCard({
  locale,
  initialPercent,
}: GlobalDiscountCardProps) {
  const copy = getAdminCopy(locale).discounts;
  const common = getAdminCopy(locale).common;
  const router = useRouter();
  const sourceValue = initialPercent != null ? String(initialPercent) : "";
  const [value, setValue] = useSyncedState(sourceValue);
  const [saved, setSaved] = useSyncedState(initialPercent);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save(next: number | null): void {
    startTransition(async () => {
      setError(null);
      setMessage(null);
      const result = await setGlobalDiscountAction(locale, next);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setSaved(result.value.percentage);
      setValue(
        result.value.percentage != null ? String(result.value.percentage) : "",
      );
      setMessage(
        result.value.percentage == null
          ? copy.globalCleared
          : formatAdminMessage(copy.globalSet, {
              percent: result.value.percentage,
            }),
      );
      router.refresh();
    });
  }

  return (
    <article className={DISCOUNT_GLOBAL_CARD}>
      <div className="mb-4 flex items-center gap-3">
        <span className={DISCOUNT_ICON_ROSE}>
          <CircleDollarSign className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-marco-ink">
            {copy.globalTitle}
          </h2>
          <p className="text-xs text-gray-500">{copy.globalSubtitle}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-100/80 bg-white/90 p-3">
          <label className="sr-only" htmlFor="global-discount-input">
            {copy.globalPercentAria}
          </label>
          <input
            id="global-discount-input"
            type="number"
            min={0}
            max={100}
            inputMode="numeric"
            placeholder="0"
            value={value}
            disabled={isPending}
            onChange={(event) => setValue(event.target.value)}
            className={DISCOUNT_FIELD}
          />
          <span className="w-8 text-sm font-semibold text-marco-slate">%</span>
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              const parsed = parseDiscountPercent(value);
              if (parsed === "invalid") {
                setError(copy.globalInvalid);
                return;
              }
              save(parsed);
            }}
            className={DISCOUNT_PRIMARY_BUTTON}
          >
            {isPending ? common.saving : common.save}
          </button>
        </div>

        <p className={saved == null ? DISCOUNT_STATUS_IDLE : DISCOUNT_STATUS_ACTIVE}>
          {saved == null
            ? copy.globalEmptyHint
            : formatAdminMessage(copy.globalActive, { percent: saved })}
        </p>

        <div className="grid grid-cols-5 gap-2">
          {QUICK_PERCENTS.map((percent) => (
            <button
              key={percent}
              type="button"
              disabled={isPending}
              onClick={() => setValue(String(percent))}
              className={DISCOUNT_QUICK_BUTTON}
            >
              {percent}%
            </button>
          ))}
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setValue("");
              setError(null);
              setMessage(null);
            }}
            className="w-full rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
          >
            {common.cancel}
          </button>
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
    </article>
  );
}
