import type { ProductCardItem } from "@/features/products/ui/ProductCard";
import { CatalogProductCardSlot } from "@/features/products/ui/CatalogProductCardSlot";
import { CATALOG_GRID } from "@/features/products/ui/catalog-filter-classes";
import { CatalogProductGridShell } from "@/features/products/ui/CatalogProductGridShell";
import type { Locale } from "@/lib/i18n/config";

type CatalogProductGridProps = {
  locale: Locale;
  emptyLabel: string;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  products: readonly ProductCardItem[];
  gridClassName?: string;
};

export function CatalogProductGrid({
  locale,
  emptyLabel,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  isSignedIn,
  products,
  gridClassName = CATALOG_GRID,
}: CatalogProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-lg text-marco-slate">{emptyLabel}</p>
    );
  }

  return (
    <CatalogProductGridShell fallbackClassName={gridClassName}>
      {products.map((product, index) => (
        <CatalogProductCardSlot
          key={product.id}
          product={product}
          locale={locale}
          wishlistLabel={wishlistLabel}
          compareLabel={compareLabel}
          addToCartLabel={addToCartLabel}
          isSignedIn={isSignedIn}
          priority={index < 4}
        />
      ))}
    </CatalogProductGridShell>
  );
}
