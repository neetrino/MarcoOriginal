type ProductDrawerPriceTypeToggleProps = {
  value: "SIMPLE" | "VARIABLE";
  simpleLabel: string;
  variableLabel: string;
  typeLabel: string;
  disabled?: boolean;
  /** Temporarily hide/disable creating variable products. */
  variableDisabled?: boolean;
  onChange: (value: "SIMPLE" | "VARIABLE") => void;
};

export function ProductDrawerPriceTypeToggle({
  value,
  simpleLabel,
  variableLabel,
  typeLabel,
  disabled = false,
  variableDisabled = false,
  onChange,
}: ProductDrawerPriceTypeToggleProps) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold tracking-wide text-slate-400 uppercase">
        {typeLabel}
      </h3>
      <div
        role="radiogroup"
        aria-label={typeLabel}
        className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-1"
      >
        {(
          [
            { value: "SIMPLE" as const, label: simpleLabel },
            { value: "VARIABLE" as const, label: variableLabel },
          ] as const
        ).map((option) => {
          const selected = option.value === value;
          const optionDisabled =
            disabled ||
            (variableDisabled &&
              option.value === "VARIABLE" &&
              value !== "VARIABLE");
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={optionDisabled}
              onClick={() => onChange(option.value)}
              className={`min-h-11 flex-1 rounded-xl px-4 text-sm font-semibold transition-colors ${
                selected
                  ? "bg-marco-slate text-white shadow-sm"
                  : optionDisabled
                    ? "cursor-not-allowed text-slate-300"
                    : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
