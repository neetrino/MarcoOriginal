import { Trash2 } from "lucide-react";

import {
  ADMIN_INPUT,
  ADMIN_LABEL,
} from "@/features/admin/ui/admin-form-classes";
import type { ProductSpecification } from "@/features/products/domain/product-specs";

type SpecCopy = {
  specTitle: string;
  specValue: string;
  specTitlePlaceholder: string;
  specValuePlaceholder: string;
  removeSpec: string;
};

type ProductSpecRowProps = {
  spec: ProductSpecification;
  disabled: boolean;
  copy: SpecCopy;
  onChange: (spec: ProductSpecification) => void;
  onRemove: () => void;
};

export function ProductSpecRow({
  spec,
  disabled,
  copy,
  onChange,
  onRemove,
}: ProductSpecRowProps) {
  return (
    <div className="grid items-end gap-3 sm:grid-cols-[1fr_minmax(0,1.4fr)_auto]">
      <label>
        <span className={ADMIN_LABEL}>{copy.specTitle}</span>
        <input
          value={spec.title}
          disabled={disabled}
          placeholder={copy.specTitlePlaceholder}
          onChange={(event) => onChange({ ...spec, title: event.target.value })}
          className={ADMIN_INPUT}
        />
      </label>
      <label>
        <span className={ADMIN_LABEL}>{copy.specValue}</span>
        <input
          value={spec.value}
          disabled={disabled}
          placeholder={copy.specValuePlaceholder}
          onChange={(event) => onChange({ ...spec, value: event.target.value })}
          className={ADMIN_INPUT}
        />
      </label>
      <button
        type="button"
        disabled={disabled}
        aria-label={copy.removeSpec}
        onClick={onRemove}
        className="mb-1 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
