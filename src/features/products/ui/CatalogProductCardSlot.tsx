"use client";

import {
  ProductCard,
  type ProductCardItem,
} from "@/features/products/ui/ProductCard";
import { useIsMaxMd } from "@/features/home/ui/use-is-max-md";
import { PRODUCT_CARD_PLP_MAX_WIDTH_CLASS } from "@/features/products/ui/product-card.constants";
import type { Locale } from "@/lib/i18n/config";

type CatalogProductCardSlotProps = {
  product: ProductCardItem;
  locale: Locale;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  isSignedIn: boolean;
  priority?: boolean;
};

/** PLP card cell — `mobileGrid` chrome below `md`, matching marco.am ProductsGrid. */
export function CatalogProductCardSlot({
  product,
  locale,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  isSignedIn,
  priority = false,
}: CatalogProductCardSlotProps) {
  const isMaxMd = useIsMaxMd();

  return (
    <div className="flex min-w-0 justify-center pb-7 sm:justify-end sm:pr-3 sm:pb-0 md:pr-4">
      <ProductCard
        product={product}
        locale={locale}
        wishlistLabel={wishlistLabel}
        compareLabel={compareLabel}
        addToCartLabel={addToCartLabel}
        isSignedIn={isSignedIn}
        priority={priority}
        layout={isMaxMd ? "mobileGrid" : "default"}
        maxWidthClassName={PRODUCT_CARD_PLP_MAX_WIDTH_CLASS}
      />
    </div>
  );
}
