import { getCurrencyMeta } from "@/lib/money/currency-meta";
import type { Currency } from "@/lib/money/currency";

const ARCA_CURRENCY_CODES: Record<Currency, string> = {
  AMD: "051",
  USD: "840",
  RUB: "643",
};

/**
 * ArCa expects amounts in gateway minimal units.
 * AMD is stored as whole dram (scale 0) but ArCa still wants ×100.
 * USD/RUB are already minor units in our DB.
 */
export function toArcaAmount(
  amountMinor: number,
  currency: Currency,
): number {
  const { scale } = getCurrencyMeta(currency);
  if (scale === 0) {
    return amountMinor * 100;
  }
  return amountMinor;
}

/** ISO 4217 numeric currency code for ArCa register.do. */
export function toArcaCurrencyCode(currency: Currency): string {
  return ARCA_CURRENCY_CODES[currency];
}
