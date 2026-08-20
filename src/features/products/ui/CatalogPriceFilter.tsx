"use client";

import { useEffect, useRef, useState } from "react";

import { formatCatalogFilterPrice } from "@/features/products/domain/catalog-price-bounds";
import type { Currency } from "@/lib/money/currency";

const PRICE_DEBOUNCE_MS = 400;

const RANGE_INPUT =
  "pointer-events-none absolute inset-0 h-6 w-full appearance-none bg-transparent " +
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative " +
  "[&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 " +
  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full " +
  "[&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-gray-300 " +
  "[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow " +
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 " +
  "[&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full " +
  "[&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-gray-300 " +
  "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow";

type CatalogPriceFilterProps = {
  minBound: number;
  maxBound: number;
  selectedMin: number;
  selectedMax: number;
  currency: Currency;
  minLabel: string;
  maxLabel: string;
  onChange: (min: number, max: number) => void;
};

export function CatalogPriceFilter({
  minBound,
  maxBound,
  selectedMin,
  selectedMax,
  currency,
  minLabel,
  maxLabel,
  onChange,
}: CatalogPriceFilterProps) {
  const [minValue, setMinValue] = useState(selectedMin);
  const [maxValue, setMaxValue] = useState(selectedMax);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (minValue === selectedMin && maxValue === selectedMax) return;
    const timer = window.setTimeout(() => {
      onChangeRef.current(minValue, maxValue);
    }, PRICE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [minValue, maxValue, selectedMin, selectedMax]);

  const span = Math.max(1, maxBound - minBound);
  const left = ((minValue - minBound) / span) * 100;
  const right = ((maxBound - maxValue) / span) * 100;
  const disabled = minBound === maxBound;

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-marco-slate">
        {formatCatalogFilterPrice(minValue, currency)}
        {" - "}
        {formatCatalogFilterPrice(maxValue, currency)}
      </p>
      <div className="relative h-6">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-marco-yellow"
          style={{ left: `${left}%`, right: `${right}%` }}
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={minValue}
          disabled={disabled}
          aria-label={minLabel}
          className={RANGE_INPUT}
          onChange={(event) => {
            const next = Number(event.target.value);
            setMinValue(Math.min(next, maxValue));
          }}
        />
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={maxValue}
          disabled={disabled}
          aria-label={maxLabel}
          className={RANGE_INPUT}
          onChange={(event) => {
            const next = Number(event.target.value);
            setMaxValue(Math.max(next, minValue));
          }}
        />
      </div>
    </div>
  );
}
