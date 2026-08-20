import {
  createDraftProductSpec,
  MAX_PRODUCT_SPECS,
  type ProductSpecification,
} from "@/features/products/domain/product-specs";
import { ProductShortTextEditor } from "@/features/products/ui/ProductShortTextEditor";
import { ProductSpecRow } from "@/features/products/ui/ProductSpecRow";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerDescriptionTabProps = {
  description: string;
  specifications: ProductSpecification[];
  disabled: boolean;
  copy: EditorCopy;
  onDescriptionChange: (html: string) => void;
  onSpecificationsChange: (rows: ProductSpecification[]) => void;
};

export function ProductDrawerDescriptionTab({
  description,
  specifications,
  disabled,
  copy,
  onDescriptionChange,
  onSpecificationsChange,
}: ProductDrawerDescriptionTabProps) {
  const canAdd = specifications.length < MAX_PRODUCT_SPECS;

  function updateSpec(index: number, next: ProductSpecification): void {
    onSpecificationsChange(
      specifications.map((row, rowIndex) => (rowIndex === index ? next : row)),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800">
          {copy.shortTextTitle}
        </h3>
        <p className="mt-1 mb-4 text-sm text-slate-400">{copy.shortTextHint}</p>
        <ProductShortTextEditor
          html={description}
          disabled={disabled}
          ariaLabel={copy.shortTextTitle}
          boldLabel={copy.boldLabel}
          italicLabel={copy.italicLabel}
          linkLabel={copy.linkLabel}
          colorLabel={copy.colorLabel}
          linkPrompt={copy.linkPrompt}
          onChange={onDescriptionChange}
        />
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {copy.specsTitle}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{copy.specsHint}</p>
          </div>
          <button
            type="button"
            disabled={disabled || !canAdd}
            onClick={() =>
              onSpecificationsChange([
                ...specifications,
                createDraftProductSpec(),
              ])
            }
            className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
          >
            {copy.addSpec}
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {specifications.map((spec, index) => (
            <ProductSpecRow
              key={spec.id}
              spec={spec}
              disabled={disabled}
              copy={copy}
              onChange={(next) => updateSpec(index, next)}
              onRemove={() =>
                onSpecificationsChange(
                  specifications.filter((_, rowIndex) => rowIndex !== index),
                )
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
