import { notFound } from "next/navigation";

import { mapProductCards } from "@/features/products/map-product-cards";
import { loadStorefrontCatalog } from "@/features/products/application/load-storefront-catalog";
import { CatalogFilterSidebar } from "@/features/products/ui/CatalogFilterSidebar";
import { CatalogPagination } from "@/features/products/ui/CatalogPagination";
import { CatalogProductGrid } from "@/features/products/ui/CatalogProductGrid";
import { getCompareProductIds } from "@/features/compare/queries";
import { getWishlistProductIds } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type ProductsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale: rawLocale } = await params;
  const rawSearch = await searchParams;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const [currency, user] = await Promise.all([
    getSelectedCurrency(),
    getCurrentUser(),
  ]);
  const catalog = await loadStorefrontCatalog(rawLocale, rawSearch, currency);
  const { products, filters, facets, priceBounds, page, totalPages } = catalog;
  const [wishlistIds, compareIds, formatPrice] = await Promise.all([
    getWishlistProductIds(products.map((item) => item.id)),
    getCompareProductIds(),
    createDisplayPriceFormatter(rawLocale, currency),
  ]);
  const cards = mapProductCards(
    products,
    rawLocale,
    formatPrice,
    dictionary.product,
    wishlistIds,
    compareIds,
  );

  return (
    <section className="-mx-4 -my-10 bg-white px-4 pt-3 pb-24 sm:-mx-6 sm:px-6 md:pb-32 lg:-mx-8 lg:px-8 lg:pt-14 lg:pb-40">
      <CatalogFilterSidebar
        locale={rawLocale}
        pageTitle={dictionary.nav.shop}
        filters={filters}
        facets={facets}
        priceBounds={priceBounds}
        currency={currency}
        copy={{
          filtersLabel: dictionary.catalog.filtersLabel,
          closeFilters: dictionary.catalog.closeFilters,
          categories: dictionary.catalog.categories,
          price: dictionary.catalog.price,
          brands: dictionary.catalog.brands,
          colors: dictionary.catalog.colors,
          expandCategory: dictionary.catalog.expandCategory,
          collapseCategory: dictionary.catalog.collapseCategory,
          minPrice: dictionary.catalog.minPrice,
          maxPrice: dictionary.catalog.maxPrice,
          sortLabel: dictionary.catalog.sortLabel,
          sortDefault: dictionary.catalog.sortDefault,
          sortPriceAsc: dictionary.catalog.sortPriceAsc,
          sortPriceDesc: dictionary.catalog.sortPriceDesc,
          sortNameAsc: dictionary.catalog.sortNameAsc,
          sortNameDesc: dictionary.catalog.sortNameDesc,
          sortProducts: dictionary.catalog.sortProducts,
          withPrice: dictionary.catalog.withPrice,
          withoutPrice: dictionary.catalog.withoutPrice,
          pricePresenceAria: dictionary.catalog.pricePresenceAria,
          viewList: dictionary.catalog.viewList,
          viewGrid: dictionary.catalog.viewGrid,
          viewDense: dictionary.catalog.viewDense,
        }}
      >
        <CatalogProductGrid
          locale={rawLocale}
          emptyLabel={dictionary.catalog.empty}
          wishlistLabel={dictionary.nav.wishlist}
          compareLabel={dictionary.nav.compare}
          addToCartLabel={dictionary.product.addToCart}
          isSignedIn={Boolean(user)}
          products={cards}
        />
        <CatalogPagination
          locale={rawLocale}
          filters={filters}
          page={page}
          totalPages={totalPages}
          copy={dictionary.catalog}
        />
      </CatalogFilterSidebar>
    </section>
  );
}
