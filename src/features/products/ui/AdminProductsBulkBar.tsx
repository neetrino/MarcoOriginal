import { Button } from "@/components/ui/Button";
import { ADMIN_PRODUCTS_BULK_CARD } from "@/features/products/ui/admin-products.classes";
import { formatAdminMessage, getAdminCopy } from "@/features/admin/ui/get-admin-copy";

type AdminProductsBulkBarProps = {
  locale: string;
  selectedCount: number;
  disabled: boolean;
  onDelete: () => void;
};

export function AdminProductsBulkBar({
  locale,
  selectedCount,
  disabled,
  onDelete,
}: AdminProductsBulkBarProps) {
  const copy = getAdminCopy(locale).products;

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4">
      <div className={ADMIN_PRODUCTS_BULK_CARD}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-amber-900">
            {formatAdminMessage(
              selectedCount === 1 ? copy.selectedOne : copy.selected,
              { count: selectedCount },
            )}
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            onClick={onDelete}
            className="border-amber-300 bg-white text-amber-900 hover:bg-amber-100"
          >
            {copy.deleteSelected}
          </Button>
        </div>
      </div>
    </div>
  );
}
