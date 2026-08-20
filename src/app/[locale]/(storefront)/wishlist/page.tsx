import Link from "next/link";
import { notFound } from "next/navigation";

import { mapProductCards } from "@/features/products/map-product-cards";
import { CatalogProductGrid } from "@/features/products/ui/CatalogProductGrid";
import { getCompareProductIds } from "@/features/compare/queries";
import { listWishlistProducts } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type WishlistPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const [user, currency, products] = await Promise.all([
    getCurrentUser(),
    getSelectedCurrency(),
    listWishlistProducts(rawLocale),
  ]);

  if (!user) {
    return (
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-marco-ink">
          {dictionary.nav.wishlist}
        </h1>
        <p className="text-marco-slate">
          <Link
            href={`/${rawLocale}/login?next=${encodeURIComponent(`/${rawLocale}/wishlist`)}`}
            className="font-medium text-marco-ink underline underline-offset-2"
          >
            {dictionary.header.login}
          </Link>{" "}
          — {dictionary.wishlist.signInPrompt}
        </p>
      </section>
    );
  }

  const formatPrice = await createDisplayPriceFormatter(rawLocale, currency);
  const compareIds = await getCompareProductIds();
  const cards = mapProductCards(
    products,
    rawLocale,
    formatPrice,
    dictionary.product,
    new Set(products.map((product) => product.id)),
    compareIds,
  );

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight text-marco-ink">
        {dictionary.nav.wishlist}
      </h1>
      <CatalogProductGrid
        locale={rawLocale}
        emptyLabel={dictionary.wishlist.empty}
        wishlistLabel={dictionary.nav.wishlist}
        compareLabel={dictionary.nav.compare}
        addToCartLabel={dictionary.product.addToCart}
        isSignedIn
        products={cards}
      />
    </section>
  );
}
