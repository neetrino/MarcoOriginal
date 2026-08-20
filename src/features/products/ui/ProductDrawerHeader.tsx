import { Star } from "lucide-react";

type ProductDrawerHeaderProps = {
  editorLabel: string;
  title: string;
  titlePlaceholder: string;
  slug: string;
  slugPlaceholder: string;
  cancelLabel: string;
  submitLabel: string;
  disabled: boolean;
  onTitleChange: (value: string) => void;
  onCancel: () => void;
};

export function ProductDrawerHeader({
  editorLabel,
  title,
  titlePlaceholder,
  slug,
  slugPlaceholder,
  cancelLabel,
  submitLabel,
  disabled,
  onTitleChange,
  onCancel,
}: ProductDrawerHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
          <Star className="h-5 w-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <label className="block">
            <span className="sr-only">{editorLabel}</span>
            <input
              required
              value={title}
              disabled={disabled}
              placeholder={titlePlaceholder}
              onChange={(event) => onTitleChange(event.target.value)}
              className="w-full bg-transparent text-xl font-semibold text-slate-500 outline-none placeholder:text-slate-300"
            />
          </label>
          <p className="truncate text-sm text-slate-300">
            {slug || slugPlaceholder}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          {cancelLabel}
        </button>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-marco-yellow px-5 py-2 text-sm font-semibold text-marco-slate transition-[filter] hover:brightness-95"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
