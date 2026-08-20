import { convertAmount, convertQuoteToBase } from "@/lib/money/convert";
import type { Currency } from "@/lib/money/currency";
import { currencySymbols, defaultCurrency } from "@/lib/money/currency";
import { getCurrencyMeta } from "@/lib/money/currency-meta";

function toSafeInt(value: bigint): number {
  const max = BigInt(Number.MAX_SAFE_INTEGER);
  if (value > max) return Number.MAX_SAFE_INTEGER;
  if (value < 0n) return 0;
  return Number(value);
}

function majorToMinor(major: number, currency: Currency): bigint {
  const scale = getCurrencyMeta(currency).scale;
  return BigInt(Math.max(0, Math.floor(major))) * 10n ** BigInt(scale);
}

function minorToMajorFloor(minor: bigint, currency: Currency): number {
  const scale = getCurrencyMeta(currency).scale;
  if (scale === 0) return toSafeInt(minor);
  return toSafeInt(minor / 10n ** BigInt(scale));
}

function minorToMajorCeil(minor: bigint, currency: Currency): number {
  const scale = getCurrencyMeta(currency).scale;
  if (scale === 0) return toSafeInt(minor);
  const divisor = 10n ** BigInt(scale);
  return toSafeInt((minor + divisor - 1n) / divisor);
}

export type DisplayMajorRange = {
  minMajor: number;
  maxMajor: number;
};

/** Converts a base-AMD catalog min/max into display-currency major units. */
export function amdRangeToDisplayMajor(
  minAmd: number,
  maxAmd: number,
  currency: Currency,
  rate: string,
): DisplayMajorRange {
  const minMinor = convertAmount(minAmd, rate, defaultCurrency, currency);
  const maxMinor = convertAmount(maxAmd, rate, defaultCurrency, currency);
  const minMajor = minorToMajorFloor(minMinor.amount, currency);
  const maxMajor = Math.max(
    minMajor,
    minorToMajorCeil(maxMinor.amount, currency),
  );
  return { minMajor, maxMajor };
}

/** Converts display-currency major bounds back to inclusive AMD amounts. */
export function displayMajorRangeToAmd(
  minMajor: number,
  maxMajor: number,
  currency: Currency,
  rate: string,
): { minAmd: number; maxAmd: number } {
  const minQuote = majorToMinor(minMajor, currency);
  const maxQuote = majorToMinor(maxMajor, currency);
  const minAmd = toSafeInt(
    convertQuoteToBase(minQuote, rate, defaultCurrency, currency).amount,
  );
  const maxAmd = toSafeInt(
    convertQuoteToBase(maxQuote, rate, defaultCurrency, currency).amount,
  );
  return {
    minAmd: Math.min(minAmd, maxAmd),
    maxAmd: Math.max(minAmd, maxAmd),
  };
}

/** Screenshot-style filter label, e.g. `4,975 $`. */
export function formatCatalogFilterPrice(
  majorAmount: number,
  currency: Currency,
): string {
  const grouped = String(Math.round(majorAmount)).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
  return `${grouped} ${currencySymbols[currency]}`;
}

/** Drops URL price params when they match the full catalog range. */
export function normalizeSelectedPriceRange(
  selectedMin: number | null,
  selectedMax: number | null,
  bounds: DisplayMajorRange,
): { minPrice: number | null; maxPrice: number | null } {
  const minPrice = selectedMin ?? bounds.minMajor;
  const maxPrice = selectedMax ?? bounds.maxMajor;
  const clampedMin = Math.min(
    bounds.maxMajor,
    Math.max(bounds.minMajor, minPrice),
  );
  const clampedMax = Math.min(
    bounds.maxMajor,
    Math.max(clampedMin, maxPrice),
  );
  if (clampedMin === bounds.minMajor && clampedMax === bounds.maxMajor) {
    return { minPrice: null, maxPrice: null };
  }
  return { minPrice: clampedMin, maxPrice: clampedMax };
}
