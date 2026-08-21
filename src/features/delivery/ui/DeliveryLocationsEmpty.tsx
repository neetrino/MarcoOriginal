import { Plus, Truck } from "lucide-react";

import {
  DELIVERY_EMPTY_ICON,
  DELIVERY_EMPTY_PANEL,
} from "@/features/delivery/ui/delivery-admin.classes";
import {
  ADMIN_SECTION_TITLE,
  ADMIN_PAGE_SUBTITLE,
} from "@/features/admin/ui/admin-form-classes";
import { ADMIN_YELLOW_BUTTON_CLASS } from "@/features/admin/ui/admin-surface-classes";

type DeliveryLocationsEmptyProps = {
  title: string;
  hint: string;
  addLabel: string;
  disabled: boolean;
  onAdd: () => void;
};

export function DeliveryLocationsEmpty({
  title,
  hint,
  addLabel,
  disabled,
  onAdd,
}: DeliveryLocationsEmptyProps) {
  return (
    <div className="px-5 py-12 sm:px-6">
      <div className={DELIVERY_EMPTY_PANEL}>
        <div className={DELIVERY_EMPTY_ICON}>
          <Truck className="h-8 w-8" aria-hidden />
        </div>
        <h2 className={`mt-5 ${ADMIN_SECTION_TITLE}`}>{title}</h2>
        <p className={`mx-auto mt-2 max-w-xl ${ADMIN_PAGE_SUBTITLE}`}>{hint}</p>
        <button
          type="button"
          onClick={onAdd}
          disabled={disabled}
          className={`${ADMIN_YELLOW_BUTTON_CLASS} mt-6 h-11`}
        >
          <Plus className="h-4 w-4" aria-hidden />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
