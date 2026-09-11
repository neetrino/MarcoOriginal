import "server-only";

import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "@/db/client";
import { productBrands, productCategories, promotions } from "@/db/schema";
import { isAutomaticDiscountCurrentlyActive } from "@/features/promotions/domain/discount-ends-at";
import {
  resolveCatalogPrice,
  type ResolvedCatalogPrice,
} from "@/features/promotions/domain/resolve-automatic-discount";
import { getStoreGlobalDiscount } from "@/features/settings/application/queries";

export type ProductPriceInput = {
  id: string;
  priceAmount: number;
  compareAtAmount?: number | null;
};

type AutomaticPromoRow = {
  discountValue: number;
  startsAt: Date | null;
  endsAt: Date | null;
  productId: string | null;
  categoryId: string | null;
  brandId: string | null;
};

/**
 * Batch-resolves catalog unit prices with automatic discounts applied.
 * Used by storefront listing, PDP, cart, and checkout.
 */
export async function resolveProductPrices(
  products: ProductPriceInput[],
): Promise<Map<string, ResolvedCatalogPrice>> {
  const result = new Map<string, ResolvedCatalogPrice>();
  if (products.length === 0) {
    return result;
  }

  const productIds = products.map((product) => product.id);
  const now = new Date();
  const [globalDiscount, promoRows, categoryLinks, brandLinks] =
    await Promise.all([
      getStoreGlobalDiscount(),
      getDb()
        .select({
          discountValue: promotions.discountValue,
          startsAt: promotions.startsAt,
          endsAt: promotions.endsAt,
          productId: promotions.productId,
          categoryId: promotions.categoryId,
          brandId: promotions.brandId,
        })
        .from(promotions)
        .where(
          and(
            eq(promotions.kind, "AUTOMATIC"),
            eq(promotions.discountType, "PERCENTAGE"),
            eq(promotions.isActive, true),
          ),
        ),
      getDb()
        .select({
          productId: productCategories.productId,
          categoryId: productCategories.categoryId,
        })
        .from(productCategories)
        .where(inArray(productCategories.productId, productIds)),
      getDb()
        .select({
          productId: productBrands.productId,
          brandId: productBrands.brandId,
        })
        .from(productBrands)
        .where(inArray(productBrands.productId, productIds)),
    ]);

  const productPercent = new Map<string, number>();
  const categoryPercent = new Map<string, number>();
  const brandPercent = new Map<string, number>();
  for (const promo of promoRows as AutomaticPromoRow[]) {
    if (
      !isAutomaticDiscountCurrentlyActive({
        startsAt: promo.startsAt,
        endsAt: promo.endsAt,
        now,
      })
    ) {
      continue;
    }
    if (promo.productId) {
      const current = productPercent.get(promo.productId);
      if (current == null || promo.discountValue > current) {
        productPercent.set(promo.productId, promo.discountValue);
      }
    }
    if (promo.categoryId) {
      const current = categoryPercent.get(promo.categoryId);
      if (current == null || promo.discountValue > current) {
        categoryPercent.set(promo.categoryId, promo.discountValue);
      }
    }
    if (promo.brandId) {
      const current = brandPercent.get(promo.brandId);
      if (current == null || promo.discountValue > current) {
        brandPercent.set(promo.brandId, promo.discountValue);
      }
    }
  }

  const categoriesByProduct = new Map<string, string[]>();
  for (const link of categoryLinks) {
    const list = categoriesByProduct.get(link.productId) ?? [];
    list.push(link.categoryId);
    categoriesByProduct.set(link.productId, list);
  }

  const brandsByProduct = new Map<string, string[]>();
  for (const link of brandLinks) {
    const list = brandsByProduct.get(link.productId) ?? [];
    list.push(link.brandId);
    brandsByProduct.set(link.productId, list);
  }

  const globalPercent =
    globalDiscount.percentage != null &&
    isAutomaticDiscountCurrentlyActive({
      endsAt: globalDiscount.endsAt
        ? new Date(globalDiscount.endsAt)
        : null,
      now,
    })
      ? globalDiscount.percentage
      : null;

  for (const product of products) {
    const categoryIds = categoriesByProduct.get(product.id) ?? [];
    const categoryPercents = categoryIds.map(
      (categoryId) => categoryPercent.get(categoryId) ?? null,
    );
    const brandIds = brandsByProduct.get(product.id) ?? [];
    const brandPercents = brandIds.map(
      (brandId) => brandPercent.get(brandId) ?? null,
    );

    result.set(
      product.id,
      resolveCatalogPrice({
        listAmount: product.priceAmount,
        productPercent: productPercent.get(product.id) ?? null,
        brandPercents,
        categoryPercents,
        globalPercent,
        manualCompareAtAmount: product.compareAtAmount ?? null,
      }),
    );
  }

  return result;
}

/** Resolves one product price (convenience wrapper). */
export async function resolveProductPrice(
  product: ProductPriceInput,
): Promise<ResolvedCatalogPrice> {
  const map = await resolveProductPrices([product]);
  return (
    map.get(product.id) ??
    resolveCatalogPrice({
      listAmount: product.priceAmount,
      manualCompareAtAmount: product.compareAtAmount ?? null,
    })
  );
}
