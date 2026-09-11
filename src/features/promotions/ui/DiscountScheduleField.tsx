"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import {
  formatDiscountScheduleLabel,
  isLocalDateBeforeToday,
  parseDiscountDateTimeInput,
  toDiscountDateTimeInput,
  toLocalDateKey,
} from "@/features/promotions/domain/discount-ends-at";
import {
  DISCOUNT_GHOST_BUTTON,
  DISCOUNT_PRIMARY_BUTTON,
} from "@/features/promotions/ui/discount-admin.classes";

export type DiscountScheduleCopy = {
  placeholder: string;
  startTab: string;
  endTab: string;
  timeHeading: string;
  hourLabel: string;
  minuteLabel: string;
  apply: string;
  clear: string;
  label: string;
};

type ScheduleMode = "start" | "end";

type DiscountScheduleFieldProps = {
  id: string;
  locale: string;
  copy: DiscountScheduleCopy;
  startsAt: string;
  endsAt: string;
  disabled?: boolean;
  onChange: (next: { startsAt: string; endsAt: string }) => void;
};

type DraftParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

const POPOVER_WIDTH_PX = 328;

function partsFromValue(value: string, fallback: Date): DraftParts {
  const parsed = parseDiscountDateTimeInput(value);
  const date = parsed instanceof Date ? parsed : fallback;
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
    hour: parsed instanceof Date ? date.getHours() : 0,
    minute: parsed instanceof Date ? date.getMinutes() : 0,
  };
}

function partsToValue(parts: DraftParts): string {
  const date = new Date(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
    0,
    0,
  );
  return toDiscountDateTimeInput(date);
}

function clampHour(raw: string): number {
  const next = Number(raw);
  if (!Number.isFinite(next)) return 0;
  return Math.min(23, Math.max(0, Math.trunc(next)));
}

function clampMinute(raw: string): number {
  const next = Number(raw);
  if (!Number.isFinite(next)) return 0;
  return Math.min(59, Math.max(0, Math.trunc(next)));
}

/** Start/end datetime picker with calendar + hour/minute (past days disabled). */
export function DiscountScheduleField({
  id,
  locale,
  copy,
  startsAt,
  endsAt,
  disabled = false,
  onChange,
}: DiscountScheduleFieldProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ScheduleMode>("start");
  const [draftStartsAt, setDraftStartsAt] = useState(startsAt);
  const [draftEndsAt, setDraftEndsAt] = useState(endsAt);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [viewMonth, setViewMonth] = useState(() => {
    const seed = parseDiscountDateTimeInput(startsAt || endsAt);
    const date = seed instanceof Date ? seed : new Date();
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });

  useEffect(() => {
    if (!open) return;
    setDraftStartsAt(startsAt);
    setDraftEndsAt(endsAt);
    const seed = parseDiscountDateTimeInput(startsAt || endsAt);
    const date = seed instanceof Date ? seed : new Date();
    setViewMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    setMode("start");
  }, [open, startsAt, endsAt]);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    function updatePosition(): void {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const left = Math.min(
        Math.max(8, rect.right - POPOVER_WIDTH_PX),
        window.innerWidth - POPOVER_WIDTH_PX - 8,
      );
      setPosition({ top: rect.bottom + 8, left });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent): void {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const activeValue = mode === "start" ? draftStartsAt : draftEndsAt;
  const activeParts = useMemo(
    () => partsFromValue(activeValue, new Date()),
    [activeValue],
  );

  const summary = useMemo(() => {
    const value = mode === "start" ? draftStartsAt : draftEndsAt;
    const parsed = parseDiscountDateTimeInput(value);
    if (!(parsed instanceof Date)) return "";
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsed);
  }, [draftEndsAt, draftStartsAt, locale, mode]);

  const chipLabel = formatDiscountScheduleLabel(startsAt, endsAt, locale);

  function updateActive(parts: DraftParts): void {
    const next = partsToValue(parts);
    if (mode === "start") setDraftStartsAt(next);
    else setDraftEndsAt(next);
  }

  function selectDay(year: number, month: number, day: number): void {
    updateActive({ ...activeParts, year, month, day });
  }

  function apply(): void {
    const startParsed = parseDiscountDateTimeInput(draftStartsAt);
    const endParsed = parseDiscountDateTimeInput(draftEndsAt);
    if (startParsed === "invalid" || endParsed === "invalid") return;

    let nextStartsAt = draftStartsAt;
    let nextEndsAt = draftEndsAt;

    if (
      startParsed instanceof Date &&
      endParsed instanceof Date &&
      endParsed.getTime() < startParsed.getTime()
    ) {
      nextEndsAt = draftStartsAt;
      nextStartsAt = draftEndsAt;
    }

    onChange({ startsAt: nextStartsAt, endsAt: nextEndsAt });
    setOpen(false);
  }

  function clear(): void {
    setDraftStartsAt("");
    setDraftEndsAt("");
    onChange({ startsAt: "", endsAt: "" });
    setOpen(false);
  }

  const popover =
    open && position && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label={copy.label}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: POPOVER_WIDTH_PX,
              zIndex: 1000,
            }}
            className="rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
              <ModeTab
                active={mode === "start"}
                label={copy.startTab}
                onClick={() => setMode("start")}
              />
              <ModeTab
                active={mode === "end"}
                label={copy.endTab}
                onClick={() => setMode("end")}
              />
            </div>

            <CalendarMonth
              locale={locale}
              viewMonth={viewMonth}
              selected={
                activeValue
                  ? {
                      year: activeParts.year,
                      month: activeParts.month,
                      day: activeParts.day,
                    }
                  : null
              }
              minDate={
                mode === "end" && draftStartsAt
                  ? (() => {
                      const start = parseDiscountDateTimeInput(draftStartsAt);
                      return start instanceof Date ? start : new Date();
                    })()
                  : new Date()
              }
              onViewMonthChange={setViewMonth}
              onSelectDay={selectDay}
            />

            <div className="mt-3 rounded-xl bg-gray-50 p-3">
              <p className="mb-2 text-xs font-bold tracking-wide text-marco-slate">
                {copy.timeHeading}
              </p>
              <div className="flex items-end gap-2">
                <TimeField
                  id={`${id}-${mode}-hour`}
                  label={copy.hourLabel}
                  value={String(activeParts.hour).padStart(2, "0")}
                  max={23}
                  onChange={(raw) =>
                    updateActive({ ...activeParts, hour: clampHour(raw) })
                  }
                />
                <span className="pb-2 text-lg font-semibold text-marco-slate">
                  :
                </span>
                <TimeField
                  id={`${id}-${mode}-minute`}
                  label={copy.minuteLabel}
                  value={String(activeParts.minute).padStart(2, "0")}
                  max={59}
                  onChange={(raw) =>
                    updateActive({ ...activeParts, minute: clampMinute(raw) })
                  }
                />
              </div>
              {summary ? (
                <p className="mt-2 text-xs text-marco-slate/70">{summary}</p>
              ) : null}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={clear}
                className={DISCOUNT_GHOST_BUTTON}
              >
                {copy.clear}
              </button>
              <button
                type="button"
                onClick={apply}
                className={DISCOUNT_PRIMARY_BUTTON}
              >
                {copy.apply}
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative inline-flex shrink-0">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-label={copy.label}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) setOpen((current) => !current);
        }}
        className={`inline-flex min-w-[10.5rem] max-w-[16rem] items-center gap-1.5 rounded-lg border border-rose-200/80 bg-white px-2 py-1.5 text-left text-sm transition-colors ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-rose-300 hover:bg-rose-50/80"
        }`}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-rose-500" aria-hidden />
        <span
          className={`min-w-0 flex-1 truncate font-medium ${
            chipLabel ? "text-marco-ink" : "text-rose-500"
          }`}
        >
          {chipLabel || copy.placeholder}
        </span>
      </button>
      {popover}
    </div>
  );
}

function ModeTab({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-white text-marco-ink shadow-sm"
          : "text-marco-slate hover:text-marco-ink"
      }`}
    >
      {label}
    </button>
  );
}

function TimeField({
  id,
  label,
  value,
  max,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  max: number;
  onChange: (raw: string) => void;
}) {
  return (
    <label className="flex flex-1 flex-col gap-1 text-xs text-marco-slate">
      <span>{label}</span>
      <input
        id={id}
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-semibold text-marco-ink outline-none focus:border-rose-300"
      />
    </label>
  );
}

type CalendarMonthProps = {
  locale: string;
  viewMonth: Date;
  selected: { year: number; month: number; day: number } | null;
  minDate: Date;
  onViewMonthChange: (next: Date) => void;
  onSelectDay: (year: number, month: number, day: number) => void;
};

function CalendarMonth({
  locale,
  viewMonth,
  selected,
  minDate,
  onViewMonthChange,
  onSelectDay,
}: CalendarMonthProps) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = (firstDay.getDay() + 6) % 7; // Monday-first
  const todayKey = toLocalDateKey(new Date());
  const minKey = toLocalDateKey(minDate);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(viewMonth);

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(2024, 0, 1 + index); // Mon..Sun starting 2024-01-01
      return formatter.format(date);
    });
  }, [locale]);

  const cells: Array<{ day: number; muted: boolean } | null> = [];
  for (let i = 0; i < startWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, muted: false });
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => onViewMonthChange(new Date(year, month - 1, 1))}
          className="rounded-lg p-1 text-marco-slate hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold capitalize text-marco-ink">
          {monthLabel}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => onViewMonthChange(new Date(year, month + 1, 1))}
          className="rounded-lg p-1 text-marco-slate hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekdayLabels.map((label) => (
          <span
            key={label}
            className="text-center text-[11px] font-medium uppercase text-marco-slate/60"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, index) => {
          if (!cell) {
            return <span key={`empty-${index}`} className="h-8" />;
          }

          const date = new Date(year, month, cell.day);
          const key = toLocalDateKey(date);
          const disabled =
            isLocalDateBeforeToday(date) || key < minKey;
          const isSelected =
            selected != null &&
            selected.year === year &&
            selected.month === month &&
            selected.day === cell.day;
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDay(year, month, cell.day)}
              className={`h-8 rounded-lg text-sm font-medium transition-colors ${
                disabled
                  ? "cursor-not-allowed text-marco-slate/30"
                  : isSelected
                    ? "bg-rose-500 text-white"
                    : isToday
                      ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                      : "text-marco-ink hover:bg-gray-100"
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
