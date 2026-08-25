"use client";

import type { AdminAttributeListItem } from "@/features/attributes/domain/attribute-admin-model";
import { ProductDrawerAttributeValueSelect } from "@/features/products/ui/ProductDrawerAttributeValueSelect";
import { VARIANT_FIELD_LABEL } from "@/features/products/ui/product-drawer-variant.classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerSimpleAttributeValuesProps = {
  copy: EditorCopy;
  attributes: readonly AdminAttributeListItem[];
  attributeValueIds: Record<string, string>;
  disabled: boolean;
  onChange: (attributeValueIds: Record<string, string>) => void;
};

export function ProductDrawerSimpleAttributeValues({
  copy,
  attributes,
  attributeValueIds,
  disabled,
  onChange,
}: ProductDrawerSimpleAttributeValuesProps) {
  if (attributes.length === 0) return null;

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      {attributes.map((attribute) => (
        <div key={attribute.id}>
          <span className={VARIANT_FIELD_LABEL}>{attribute.title}</span>
          <ProductDrawerAttributeValueSelect
            attributeTitle={attribute.title}
            modalTitle={copy.variableSelectValueTitle.replace(
              "{name}",
              attribute.title,
            )}
            closeLabel={copy.variableValueModalClose}
            value={attributeValueIds[attribute.id] ?? ""}
            allLabel={copy.variableValuePlaceholder}
            values={attribute.values}
            disabled={disabled}
            triggerClassName="h-11 rounded-lg border-gray-300"
            onValueChange={(valueId) =>
              onChange({
                ...attributeValueIds,
                [attribute.id]: valueId,
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
