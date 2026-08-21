import {
  CATALOG_PICKER_CHECK,
  CATALOG_PICKER_CHECK_ON,
} from "@/features/products/ui/product-drawer-catalog.classes";

export function ProductDrawerCatalogCheck({
  selected,
}: {
  selected: boolean;
}) {
  return (
    <span
      className={selected ? CATALOG_PICKER_CHECK_ON : CATALOG_PICKER_CHECK}
      aria-hidden
    >
      {selected ? (
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
          <path
            d="M2.5 6.2 4.8 8.5 9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </span>
  );
}
