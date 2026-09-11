import "server-only";

import { and, asc, desc, eq, isNotNull, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { mediaAssets, products, promotions } from "@/db/schema";
import { listAdminBrands } from "@/features/brands/application/list-admin-brands";
import { listAdminCategories } from "@/features/categories/application/list-admin-categories";
import { toDiscountEndsAtInput } from "@/features/promotions/domain/discount-ends-at";
import { getStoreGlobalDiscount } from "@/features/settings/application/queries";
import type { Locale } from "@/lib/i18n/config";
import { mediaPublicUrl } from "@/lib/media/public-url";

export type DiscountBoardCategory = {
  id: string;
  title: string;
  parentId: string | null;
  discountPercent: number | null;
  endsAt: string | null;
  promotionId: string | null;
};

export type DiscountBoardBrand = {
  id: string;
  title: string;
  sku: string;
  discountPercent: number | null;
  endsAt: string | null;
  promotionId: string | null;
};

export type DiscountBoardProduct = {
  id: string;
  title: string;
  slug: string;
  sku: string;
  priceAmount: number;
  imageUrl: string | null;
  discountPercent: number | null;
  endsAt: string | null;
  promotionId: string | null;
};

export type AdminDiscountsBoard = {
  globalPercent: number | null;
  globalEndsAt: string | null;
  categories: DiscountBoardCategory[];
  brands: DiscountBoardBrand[];
  products: DiscountBoardProduct[];
};

type AutomaticTargetPromo = {
  id: string;
  discountValue: number;
  endsAt: Date | null;
  productId: string | null;
  categoryId: string | null;
  brandId: string | null;
};

/** Loads the admin discounts board: global %, categories, brands, and products. */
export async function getAdminDiscountsBoard(
  locale: Locale,
): Promise<AdminDiscountsBoard> {
  const [
    globalDiscount,
    categoryRows,
    brandRows,
    productRows,
    promoRows,
    imageRows,
  ] = await Promise.all([
    getStoreGlobalDiscount(),
    listAdminCategories(locale),
    listAdminBrands(locale),
    getDb()
      .select({
        id: products.id,
        sku: products.sku,
        priceAmount: products.priceAmount,
        translations: products.translations,
      })
      .from(products)
      .where(isNull(products.deletedAt))
      .orderBy(asc(products.sku)),
    getDb()
      .select({
        id: promotions.id,
        discountValue: promotions.discountValue,
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
      )
      .orderBy(desc(promotions.updatedAt)),
    getDb()
      .select({
        productId: mediaAssets.productId,
        objectKey: mediaAssets.objectKey,
      })
      .from(mediaAssets)
      .where(
        and(
          isNotNull(mediaAssets.productId),
          eq(mediaAssets.uploadStatus, "READY"),
          eq(mediaAssets.isPrimary, true),
        ),
      ),
  ]);

  const byProduct = new Map<string, AutomaticTargetPromo>();
  const byCategory = new Map<string, AutomaticTargetPromo>();
  const byBrand = new Map<string, AutomaticTargetPromo>();
  for (const promo of promoRows) {
    if (promo.productId && !byProduct.has(promo.productId)) {
      byProduct.set(promo.productId, promo);
    }
    if (promo.categoryId && !byCategory.has(promo.categoryId)) {
      byCategory.set(promo.categoryId, promo);
    }
    if (promo.brandId && !byBrand.has(promo.brandId)) {
      byBrand.set(promo.brandId, promo);
    }
  }

  const images = new Map<string, string>();
  for (const row of imageRows) {
    if (!row.productId || images.has(row.productId)) continue;
    images.set(row.productId, mediaPublicUrl(row.objectKey));
  }

  return {
    globalPercent: globalDiscount.percentage,
    globalEndsAt: toDiscountEndsAtInput(
      globalDiscount.endsAt ? new Date(globalDiscount.endsAt) : null,
    ) || null,
    categories: categoryRows.map((category) => {
      const promo = byCategory.get(category.id);
      return {
        id: category.id,
        title: category.title,
        parentId: category.parentId,
        discountPercent: promo?.discountValue ?? null,
        endsAt: toDiscountEndsAtInput(promo?.endsAt) || null,
        promotionId: promo?.id ?? null,
      };
    }),
    brands: brandRows.map((brand) => {
      const promo = byBrand.get(brand.id);
      return {
        id: brand.id,
        title: brand.title,
        sku: brand.sku,
        discountPercent: promo?.discountValue ?? null,
        endsAt: toDiscountEndsAtInput(promo?.endsAt) || null,
        promotionId: promo?.id ?? null,
      };
    }),
    products: productRows.map((product) => {
      const translation =
        product.translations[locale] ??
        product.translations.hy ??
        product.translations.en;
      const promo = byProduct.get(product.id);
      return {
        id: product.id,
        title: translation?.title ?? product.sku,
        slug: translation?.slug ?? "",
        sku: product.sku,
        priceAmount: product.priceAmount,
        imageUrl: images.get(product.id) ?? null,
        discountPercent: promo?.discountValue ?? null,
        endsAt: toDiscountEndsAtInput(promo?.endsAt) || null,
        promotionId: promo?.id ?? null,
      };
    }),
  };
}
