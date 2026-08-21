import { ProductDrawerCatalogCheck } from "@/features/products/ui/ProductDrawerCatalogCheck";
import { CATALOG_PICKER_ROW } from "@/features/products/ui/product-drawer-catalog.classes";

type BrandOption = {
  id: string;
  title: string;
};

type ProductDrawerBrandListProps = {
  brands: readonly BrandOption[];
  selectedIds: readonly string[];
  disabled: boolean;
  onToggle: (id: string) => void;
};

export function ProductDrawerBrandList({
  brands,
  selectedIds,
  disabled,
  onToggle,
}: ProductDrawerBrandListProps) {
  const selected = new Set(selectedIds);

  return (
    <ul>
      {brands.map((brand) => {
        const isSelected = selected.has(brand.id);
        return (
          <li key={brand.id}>
            <button
              type="button"
              disabled={disabled}
              aria-pressed={isSelected}
              className={CATALOG_PICKER_ROW}
              onClick={() => onToggle(brand.id)}
            >
              <ProductDrawerCatalogCheck selected={isSelected} />
              <span className="min-w-0 truncate">{brand.title}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
