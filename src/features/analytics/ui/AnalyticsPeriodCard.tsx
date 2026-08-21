"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { Card } from "@/components/ui/Card";
import { SelectDropdown } from "@/components/ui/SelectDropdown";
import { ADMIN_YELLOW_BUTTON_CLASS } from "@/features/admin/ui/admin-surface-classes";
import {
  getAdminCopy,
  type AdminCopy,
} from "@/features/admin/ui/get-admin-copy";
import {
  ANALYTICS_PERIOD_SELECT_OPTIONS,
  formatAnalyticsDisplayDate,
  rangeForAnalyticsPeriod,
  type AnalyticsPeriodPreset,
} from "@/features/analytics/domain/date-range";

function isSelectPeriod(
  value: AnalyticsPeriodPreset,
): value is (typeof ANALYTICS_PERIOD_SELECT_OPTIONS)[number] {
  return (ANALYTICS_PERIOD_SELECT_OPTIONS as readonly string[]).includes(value);
}
import {
  ANALYTICS_ACCENT_CLASS,
  ANALYTICS_DATE_BADGE,
  ANALYTICS_FIELD,
  ANALYTICS_PANEL_CLASS,
} from "@/features/analytics/ui/analytics-card-classes";

const PERIOD_LABEL_KEY = {
  today: "today",
  last_7_days: "last7",
  last_30_days: "last30",
  last_90_days: "last90",
  this_month: "thisMonth",
  last_year: "lastYear",
  custom: "custom",
} as const satisfies Record<AnalyticsPeriodPreset, keyof AdminCopy["analytics"]>;

type AnalyticsPeriodCardProps = {
  locale: string;
  from: string;
  to: string;
  preset: AnalyticsPeriodPreset;
  exportQuery: string;
  rangeInvalid: boolean;
};

export function AnalyticsPeriodCard({
  locale,
  from,
  to,
  preset,
  exportQuery,
  rangeInvalid,
}: AnalyticsPeriodCardProps) {
  const router = useRouter();
  const copy = getAdminCopy(locale).analytics;
  const [pending, startTransition] = useTransition();
  const [forceCustom, setForceCustom] = useState(preset === "custom");
  const selectedPreset: AnalyticsPeriodPreset =
    forceCustom || !isSelectPeriod(preset) ? "custom" : preset;

  function navigate(nextFrom: string, nextTo: string): void {
    const params = new URLSearchParams({ from: nextFrom, to: nextTo });
    setForceCustom(false);
    startTransition(() => {
      router.push(`/${locale}/admin/analytics?${params.toString()}`);
    });
  }

  function onPeriodChange(value: string): void {
    const next = value as AnalyticsPeriodPreset;
    if (next === "custom") {
      setForceCustom(true);
      return;
    }
    const range = rangeForAnalyticsPeriod(next);
    navigate(range.from, range.to);
  }

  function onCustomSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextFrom = String(data.get("from") ?? "");
    const nextTo = String(data.get("to") ?? "");
    if (!nextFrom || !nextTo) return;
    navigate(nextFrom, nextTo);
  }

  return (
    <Card className={ANALYTICS_PANEL_CLASS}>
      <div className={ANALYTICS_ACCENT_CLASS} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-marco-ink">{copy.timePeriod}</h2>
        <p className={ANALYTICS_DATE_BADGE}>
          {formatAnalyticsDisplayDate(from, locale)} –{" "}
          {formatAnalyticsDisplayDate(to, locale)}
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <span className="mb-2 block text-sm font-medium text-marco-slate/80">
            {copy.period}
          </span>
          <SelectDropdown
            ariaLabel={copy.periodAria}
            value={selectedPreset}
            options={ANALYTICS_PERIOD_SELECT_OPTIONS.map((option) => ({
              label: copy[PERIOD_LABEL_KEY[option]],
              value: option,
            }))}
            disabled={pending}
            deferChange={false}
            onValueChange={onPeriodChange}
          />
        </div>
      </div>

      {selectedPreset === "custom" ? (
        <form
          onSubmit={onCustomSubmit}
          className="mt-4 flex flex-wrap items-end gap-3"
        >
          <label className="min-w-[200px] flex-1">
            <span className="mb-2 block text-sm font-medium text-marco-slate/80">
              {copy.from}
            </span>
            <input name="from" type="date" defaultValue={from} className={ANALYTICS_FIELD} />
          </label>
          <label className="min-w-[200px] flex-1">
            <span className="mb-2 block text-sm font-medium text-marco-slate/80">
              {copy.to}
            </span>
            <input name="to" type="date" defaultValue={to} className={ANALYTICS_FIELD} />
          </label>
          <button type="submit" disabled={pending} className={ADMIN_YELLOW_BUTTON_CLASS}>
            {copy.apply}
          </button>
        </form>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <a
          href={`/api/exports/admin/analytics?${exportQuery}`}
          className="text-sm font-medium text-marco-slate/80 underline-offset-2 hover:underline"
        >
          {copy.downloadCsv}
        </a>
        {rangeInvalid ? (
          <p className="text-sm text-red-700">{copy.invalidRange}</p>
        ) : null}
      </div>
    </Card>
  );
}
