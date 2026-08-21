import { notFound } from "next/navigation";

import { mapProductCards } from "@/features/products/map-product-cards";
import { getCompareProductIds } from "@/features/compare/queries";
import { listWishlistProducts } from "@/features/wishlist/queries";
import { WishlistView } from "@/features/wishlist/ui/WishlistView";
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

export async function generateMetadata({ params }: WishlistPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).wishlist.title };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const user = await getCurrentUser();
  const shared = {
    locale: rawLocale,
    copy: dictionary.wishlist,
    loginLabel: dictionary.header.login,
    wishlistLabel: dictionary.nav.wishlist,
    compareLabel: dictionary.nav.compare,
    addToCartLabel: dictionary.product.addToCart,
  };

  if (!user) {
    return <WishlistView {...shared} isSignedIn={false} products={[]} />;
  }

  const [currency, products, compareIds] = await Promise.all([
    getSelectedCurrency(),
    listWishlistProducts(rawLocale),
    getCompareProductIds(),
  ]);
  const formatPrice = await createDisplayPriceFormatter(rawLocale, currency);
  const cards = mapProductCards(
    products,
    rawLocale,
    formatPrice,
    dictionary.product,
    new Set(products.map((product) => product.id)),
    compareIds,
  );

  return <WishlistView {...shared} isSignedIn products={cards} />;
}
