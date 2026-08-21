import { isCurrency } from "@/lib/money/currency";
import { formatMoneyAmount } from "@/lib/money/format";

const UNKNOWN_INITIAL = "U";

/** Initials for a dashboard avatar chip. */
export function getDashboardInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  const second = parts[1];
  if (!first) {
    return UNKNOWN_INITIAL;
  }

  if (!second) {
    return first.slice(0, 2).toUpperCase();
  }

  return `${first[0] ?? ""}${second[0] ?? ""}`.toUpperCase() || UNKNOWN_INITIAL;
}

/** Locale-aware short date for dashboard lists. */
export function formatDashboardDate(value: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(value);
}

/** Formats a stored minor-unit amount for dashboard cards. */
export function formatDashboardMoney(
  amount: number,
  currency: string,
  locale: string,
): string {
  return formatMoneyAmount(amount, isCurrency(currency) ? currency : "AMD", locale);
}

/** Display name with a safe fallback. */
export function formatDashboardUserName(
  firstName: string,
  lastName: string,
  fallback: string,
): string {
  const name = `${firstName} ${lastName}`.trim();
  return name.length > 0 ? name : fallback;
}

/** Inclusive local-day window used by the sales widgets. */
export function localDayBounds(now: Date): { start: Date; end: Date } {
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    end: now,
  };
}

/** Inclusive local-month window used by the sales widgets. */
export function localMonthBounds(now: Date): { start: Date; end: Date } {
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end: now,
  };
}
