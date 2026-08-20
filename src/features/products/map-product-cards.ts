import type { CatalogProduct } from "@/features/products/types";
import type { ProductCardItem } from "@/features/products/ui/ProductCard";
import { warrantyLabelForYears } from "@/features/products/ui/ProductCardMeta";
import type { Locale } from "@/lib/i18n/config";
import type { DisplayPrice } from "@/lib/money/display-price";

type WarrantyLabels = {
  warranty1: string;
  warranty2: string;
  warranty3: string;
  warrantyBadge: string;
};

/** Maps catalog rows to the shared storefront product card. */
export function mapProductCards(
  products: readonly CatalogProduct[],
  locale: Locale,
  formatPrice: (baseAmountAmd: number) => DisplayPrice,
  warrantyLabels: WarrantyLabels,
  wishlistIds: ReadonlySet<string>,
  compareIds: ReadonlySet<string> = new Set(),
): ProductCardItem[] {
  return products.map((product) => {
    const price = formatPrice(product.priceAmount);
    const compareAt =
      product.compareAtAmount != null
        ? formatPrice(product.compareAtAmount)
        : null;

    return {
      id: product.id,
      href: `/${locale}/products/${product.translation.slug}`,
      title: product.translation.title,
      priceFormatted: price.formatted,
      compareAtFormatted: compareAt?.formatted ?? null,
      discountPercent: product.discountPercent,
      imageUrl: product.imageUrl,
      inStock: product.stockOnHand > 0,
      inWishlist: wishlistIds.has(product.id),
      inCompare: compareIds.has(product.id),
      warrantyYearsLabel: warrantyLabelForYears(
        product.warrantyYears,
        warrantyLabels,
      ),
      warrantyCaption: warrantyLabels.warrantyBadge,
      tags: product.tags,
    };
  });
}
