import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";

import { ADMIN_INPUT, ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import {
  DELIVERY_DELETE_BUTTON,
  DELIVERY_INDEX_BADGE,
  DELIVERY_LOCATION_CARD,
  DELIVERY_PRICE_PILL,
} from "@/features/delivery/ui/delivery-admin.classes";
import type {
  DeliveryLocationDraft,
  DeliveryLocationField,
} from "@/features/delivery/ui/delivery-location-draft";
import { formatMoneyAmount } from "@/lib/money/format";

type DeliveryLocationCopy = {
  country: string;
  city: string;
  price: string;
  freeFrom: string;
  countryPlaceholder: string;
  cityPlaceholder: string;
  pricePlaceholder: string;
  freeFromPlaceholder: string;
};

type DeliveryLocationCardProps = {
  index: number;
  draft: DeliveryLocationDraft;
  locale: string;
  title: string;
  deleteAria: string;
  disabled: boolean;
  copy: DeliveryLocationCopy;
  onChange: (field: DeliveryLocationField, value: string) => void;
  onDelete: () => void;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <span className={ADMIN_LABEL}>{label}</span>
      {children}
    </label>
  );
}

export function DeliveryLocationCard({
  index,
  draft,
  locale,
  title,
  deleteAria,
  disabled,
  copy,
  onChange,
  onDelete,
}: DeliveryLocationCardProps) {
  const pricePreview = Number(draft.priceAmount);
  const priceLabel = formatMoneyAmount(
    Number.isFinite(pricePreview) ? pricePreview : 0,
    "AMD",
    locale,
  );

  return (
    <article className={DELIVERY_LOCATION_CARD}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={DELIVERY_INDEX_BADGE}>{index}</div>
          <p className="text-sm font-semibold text-marco-slate">{title}</p>
        </div>
        <p className={DELIVERY_PRICE_PILL}>{priceLabel}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field label={copy.country}>
          <input
            value={draft.country}
            onChange={(event) => onChange("country", event.target.value)}
            placeholder={copy.countryPlaceholder}
            required
            disabled={disabled}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label={copy.city}>
          <input
            value={draft.city}
            onChange={(event) => onChange("city", event.target.value)}
            placeholder={copy.cityPlaceholder}
            required
            disabled={disabled}
            className={ADMIN_INPUT}
          />
        </Field>
        <Field label={copy.price}>
          <input
            type="number"
            min={0}
            step={100}
            value={draft.priceAmount}
            onChange={(event) => onChange("priceAmount", event.target.value)}
            placeholder={copy.pricePlaceholder}
            required
            disabled={disabled}
            className={ADMIN_INPUT}
          />
        </Field>
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Field label={copy.freeFrom}>
              <input
                type="number"
                min={0}
                step={100}
                value={draft.freeThresholdAmount}
                onChange={(event) =>
                  onChange("freeThresholdAmount", event.target.value)
                }
                placeholder={copy.freeFromPlaceholder}
                disabled={disabled}
                className={ADMIN_INPUT}
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={onDelete}
            disabled={disabled}
            className={DELIVERY_DELETE_BUTTON}
            aria-label={deleteAria}
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
