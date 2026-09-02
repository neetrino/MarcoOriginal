import { getCurrencyMeta } from "@/lib/money/currency-meta";
import type { Currency } from "@/lib/money/currency";

const AMOUNT_TOLERANCE = 0.01;

/** Formats store minor units as Idram EDP_AMOUNT (major units, dot decimal). */
export function toIdramAmountString(
  amountMinor: number,
  currency: Currency,
): string {
  const { scale } = getCurrencyMeta(currency);
  if (scale === 0) {
    return String(amountMinor);
  }
  const major = amountMinor / 10 ** scale;
  return major.toFixed(scale);
}

/** Compares Idram callback amount to DB minor units within tolerance. */
export function idramAmountsMatch(
  edpAmount: string,
  amountMinor: number,
  currency: Currency,
): boolean {
  const parsed = Number.parseFloat(edpAmount);
  if (!Number.isFinite(parsed)) return false;
  const { scale } = getCurrencyMeta(currency);
  const expectedMajor =
    scale === 0 ? amountMinor : amountMinor / 10 ** scale;
  return Math.abs(parsed - expectedMajor) <= AMOUNT_TOLERANCE;
}
