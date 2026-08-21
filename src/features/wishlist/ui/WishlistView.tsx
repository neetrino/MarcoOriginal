import { CatalogProductGrid } from "@/features/products/ui/CatalogProductGrid";
import type { ProductCardItem } from "@/features/products/ui/ProductCard";
import { getWishlistEmptyState } from "@/features/wishlist/ui/get-wishlist-empty-state";
import { WishlistCountBar } from "@/features/wishlist/ui/WishlistCountBar";
import { WishlistEmptyState } from "@/features/wishlist/ui/WishlistEmptyState";
import {
  WISHLIST_GRID_CLASS,
  WISHLIST_PAGE_CLASS,
  WISHLIST_TITLE_CLASS,
} from "@/features/wishlist/ui/wishlist-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type WishlistViewProps = {
  locale: Locale;
  isSignedIn: boolean;
  copy: Dictionary["wishlist"];
  loginLabel: string;
  wishlistLabel: string;
  compareLabel: string;
  addToCartLabel: string;
  products: readonly ProductCardItem[];
};

export function WishlistView({
  locale,
  isSignedIn,
  copy,
  loginLabel,
  wishlistLabel,
  compareLabel,
  addToCartLabel,
  products,
}: WishlistViewProps) {
  const emptyState = getWishlistEmptyState({
    isSignedIn,
    locale,
    copy,
    loginLabel,
  });

  return (
    <section className={WISHLIST_PAGE_CLASS}>
      <h1 className={WISHLIST_TITLE_CLASS}>{copy.title}</h1>
      {products.length > 0 ? (
        <>
          <WishlistCountBar label={copy.totalCount} count={products.length} />
          <CatalogProductGrid
            locale={locale}
            emptyLabel={copy.empty}
            wishlistLabel={wishlistLabel}
            compareLabel={compareLabel}
            addToCartLabel={addToCartLabel}
            isSignedIn={isSignedIn}
            products={products}
            gridClassName={WISHLIST_GRID_CLASS}
          />
        </>
      ) : (
        <WishlistEmptyState copy={emptyState} />
      )}
    </section>
  );
}
