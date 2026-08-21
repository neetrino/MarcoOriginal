import { z } from "zod";

const MAX_RANGE_DAYS = 366;

export const ANALYTICS_PERIOD_PRESETS = [
  "today",
  "last_7_days",
  "last_30_days",
  "last_90_days",
  "this_month",
  "last_year",
  "custom",
] as const;

/** Presets shown in the supersudo-aligned period dropdown. */
export const ANALYTICS_PERIOD_SELECT_OPTIONS = [
  "today",
  "last_7_days",
  "last_30_days",
  "last_year",
  "custom",
] as const;

export type AnalyticsPeriodPreset = (typeof ANALYTICS_PERIOD_PRESETS)[number];

export const analyticsPeriodPresetSchema = z.enum(ANALYTICS_PERIOD_PRESETS);

export const analyticsDateRangeSchema = z
  .object({
    from: z.string().date(),
    to: z.string().date(),
  })
  .refine((value) => value.from <= value.to, {
    message: "from must be on or before to",
  })
  .refine(
    (value) => {
      const start = new Date(`${value.from}T00:00:00.000Z`);
      const end = new Date(`${value.to}T00:00:00.000Z`);
      const days =
        Math.floor((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)) +
        1;
      return days <= MAX_RANGE_DAYS;
    },
    { message: `Date range must be at most ${MAX_RANGE_DAYS} days` },
  );

export type AnalyticsDateRange = z.infer<typeof analyticsDateRangeSchema>;

const PRESET_LABELS: Record<AnalyticsPeriodPreset, string> = {
  today: "Today",
  last_7_days: "Last 7 Days",
  last_30_days: "Last 30 Days",
  last_90_days: "Last 90 Days",
  this_month: "This Month",
  last_year: "Last Year",
  custom: "Custom Range",
};

/** Human label for a period preset select option. */
export function analyticsPeriodLabel(preset: AnalyticsPeriodPreset): string {
  return PRESET_LABELS[preset];
}

function utcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Inclusive UTC date range for a named analytics period preset. */
export function rangeForAnalyticsPeriod(
  preset: Exclude<AnalyticsPeriodPreset, "custom">,
): AnalyticsDateRange {
  const toDate = utcToday();
  const fromDate = new Date(toDate);

  if (preset === "today") {
    return { from: toIsoDate(toDate), to: toIsoDate(toDate) };
  }
  if (preset === "last_7_days") {
    fromDate.setUTCDate(fromDate.getUTCDate() - 6);
  } else if (preset === "last_30_days") {
    fromDate.setUTCDate(fromDate.getUTCDate() - 29);
  } else if (preset === "last_90_days") {
    fromDate.setUTCDate(fromDate.getUTCDate() - 89);
  } else if (preset === "last_year") {
    fromDate.setUTCDate(fromDate.getUTCDate() - 364);
  } else {
    fromDate.setUTCDate(1);
  }

  return { from: toIsoDate(fromDate), to: toIsoDate(toDate) };
}

/** Default inclusive last-30-days range in UTC ISO dates. */
export function defaultAnalyticsDateRange(): AnalyticsDateRange {
  return rangeForAnalyticsPeriod("last_30_days");
}

/** Detects which preset matches an inclusive from/to range. */
export function matchAnalyticsPeriodPreset(
  range: AnalyticsDateRange,
): AnalyticsPeriodPreset {
  for (const preset of [
    "today",
    "last_7_days",
    "last_30_days",
    "last_90_days",
    "this_month",
    "last_year",
  ] as const) {
    const expected = rangeForAnalyticsPeriod(preset);
    if (expected.from === range.from && expected.to === range.to) {
      return preset;
    }
  }
  return "custom";
}

/** Formats an ISO date for analytics headers (e.g. Jul 12, 2026). */
export function formatAnalyticsDisplayDate(
  isoDate: string,
  locale = "en-US",
): string {
  return new Date(`${isoDate}T00:00:00.000Z`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Formats a short chart/list date (e.g. Jul 13). */
export function formatAnalyticsShortDate(
  isoDate: string,
  locale = "en-US",
): string {
  return new Date(`${isoDate}T00:00:00.000Z`).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Formats percent delta vs a previous numeric value. */
export function formatPeriodDelta(current: number, previous: number): string {
  if (previous === 0) {
    return current > 0 ? "+100%" : "—";
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}
