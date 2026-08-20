type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type ProductDrawerSegmentedControlProps<T extends string> = {
  options: ReadonlyArray<SegmentedOption<T>>;
  value: T;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (value: T) => void;
};

export function ProductDrawerSegmentedControl<T extends string>({
  options,
  value,
  disabled = false,
  ariaLabel,
  onChange,
}: ProductDrawerSegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex overflow-hidden rounded-xl bg-slate-100 p-1"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`min-h-10 flex-1 rounded-lg px-3 text-sm font-medium transition-colors ${
              selected
                ? "bg-marco-yellow text-marco-slate shadow-sm"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
