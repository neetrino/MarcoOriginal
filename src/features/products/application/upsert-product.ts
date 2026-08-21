"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "@/db/client";
import {
  brands,
  categories,
  productBrands,
  productCategories,
  products,
  stockMovements,
  type TranslationsJson,
} from "@/db/schema";
import { persistProductMedia } from "@/features/products/application/persist-product-media";
import { parseProductTags } from "@/features/products/domain/product-presentation";
import { parseProductSpecs } from "@/features/products/domain/product-specs";
import {
  DEFAULT_PRODUCT_STOCK,
  PRODUCT_RESTOCK_AT,
} from "@/features/products/domain/product-stock";
import {
  productUpsertSchema,
  type ProductUpsertInput,
} from "@/features/products/schemas/product-drawer";
import { requireAdmin } from "@/lib/auth/policies";
import { invalidateProductsCache } from "@/lib/cache/invalidate-public";
import { createId } from "@/lib/id";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { err, ok, type Result } from "@/lib/result";
import {
  htmlToPlainText,
  sanitizeProductShortHtml,
} from "@/lib/sanitize/html";

function buildTranslations(data: ProductUpsertInput): TranslationsJson {
  const sanitized = data.description
    ? sanitizeProductShortHtml(data.description)
    : "";
  const description = htmlToPlainText(sanitized) ? sanitized : undefined;
  const specifications = parseProductSpecs(data.specifications).map((row) => ({
    title: row.title,
    value: row.value,
  }));
  const entry = {
    title: data.title,
    slug: data.slug,
    description,
    specifications: specifications.length > 0 ? specifications : undefined,
  };
  return { hy: entry, en: entry, ru: entry };
}

function revalidateProducts(
  locale: string,
  product: { id: string; slug: string; previousSlug?: string },
): void {
  revalidatePath(`/${locale}/admin/products`);
  revalidatePath(`/${locale}/products`);
  for (const loc of locales) {
    revalidatePath(`/${loc}`);
  }
  invalidateProductsCache({
    productId: product.id,
    slug: product.slug,
  });
  if (product.previousSlug && product.previousSlug !== product.slug) {
    invalidateProductsCache({ slug: product.previousSlug });
  }
}

function parsePayload(formData: FormData): ProductUpsertInput | null {
  const raw = formData.get("data");
  if (typeof raw !== "string") return null;
  try {
    return productUpsertSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

function collectImageFiles(formData: FormData): File[] {
  return formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

async function syncProductCategories(
  productId: string,
  categoryIds: string[],
): Promise<string | null> {
  const uniqueIds = [...new Set(categoryIds)];
  if (uniqueIds.length > 0) {
    const found = await getDb()
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(
          inArray(categories.id, uniqueIds),
          isNull(categories.deletedAt),
        ),
      );
    if (found.length !== uniqueIds.length) {
      return "One or more categories were not found.";
    }
  }

  await getDb()
    .delete(productCategories)
    .where(eq(productCategories.productId, productId));

  if (uniqueIds.length === 0) return null;

  await getDb().insert(productCategories).values(
    uniqueIds.map((categoryId, index) => ({
      id: createId(),
      productId,
      categoryId,
      isPrimary: index === 0,
      sortOrder: index,
    })),
  );

  return null;
}

async function syncProductBrands(
  productId: string,
  brandIds: string[],
): Promise<string | null> {
  const uniqueIds = [...new Set(brandIds)];
  if (uniqueIds.length > 0) {
    const found = await getDb()
      .select({ id: brands.id })
      .from(brands)
      .where(and(inArray(brands.id, uniqueIds), isNull(brands.deletedAt)));
    if (found.length !== uniqueIds.length) {
      return "One or more brands were not found.";
    }
  }

  await getDb()
    .delete(productBrands)
    .where(eq(productBrands.productId, productId));

  if (uniqueIds.length === 0) return null;

  await getDb().insert(productBrands).values(
    uniqueIds.map((brandId, index) => ({
      id: createId(),
      productId,
      brandId,
      isPrimary: index === 0,
      sortOrder: index,
    })),
  );

  return null;
}

/** Creates a product from the admin drawer (fields + optional images). */
export async function createProductFromDrawerAction(
  locale: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const data = parsePayload(formData);
  if (!data) {
    return err("VALIDATION_ERROR", "Invalid product payload.");
  }

  if (
    data.compareAtAmount != null &&
    data.compareAtAmount < data.priceAmount
  ) {
    return err(
      "VALIDATION_ERROR",
      "Compare-at price must be greater than or equal to price.",
    );
  }

  const actor = await requireAdmin(locale as Locale);
  const id = createId();
  const files = collectImageFiles(formData);

  await getDb().insert(products).values({
    id,
    sku: data.sku,
    priceAmount: data.priceAmount,
    compareAtAmount: data.compareAtAmount,
    stockOnHand: DEFAULT_PRODUCT_STOCK,
    lowStockThreshold: PRODUCT_RESTOCK_AT,
    status: data.status,
    salesClass: data.salesClass,
    warrantyYears: data.warrantyYears,
    tags: parseProductTags(data.tags),
    translations: buildTranslations(data),
  });

  const categoryError = await syncProductCategories(id, data.categoryIds);
  if (categoryError) {
    return err("VALIDATION_ERROR", categoryError);
  }

  const brandError = await syncProductBrands(id, data.brandIds);
  if (brandError) {
    return err("VALIDATION_ERROR", brandError);
  }

  await getDb().insert(stockMovements).values({
    id: createId(),
    productId: id,
    delta: DEFAULT_PRODUCT_STOCK,
    reason: "ADMIN_ADJUSTMENT",
    actorUserId: actor.id,
    resultingBalance: DEFAULT_PRODUCT_STOCK,
  });

  const mediaResult = await persistProductMedia({
    productId: id,
    files,
    primaryNewIndex: data.primaryNewIndex ?? (files.length > 0 ? 0 : null),
    primaryExistingId: null,
    removeImageIds: [],
  });
  if (mediaResult.error) {
    return err("VALIDATION_ERROR", mediaResult.error);
  }

  revalidateProducts(locale, { id, slug: data.slug });
  return ok({ id });
}

/** Updates a product from the admin drawer (fields + optional images). */
export async function updateProductFromDrawerAction(
  locale: string,
  productId: string,
  formData: FormData,
): Promise<Result<{ id: string }>> {
  if (!isLocale(locale)) {
    return err("INVALID_LOCALE", "Invalid locale.");
  }

  const data = parsePayload(formData);
  if (!data) {
    return err("VALIDATION_ERROR", "Invalid product payload.");
  }

  if (
    data.compareAtAmount != null &&
    data.compareAtAmount < data.priceAmount
  ) {
    return err(
      "VALIDATION_ERROR",
      "Compare-at price must be greater than or equal to price.",
    );
  }

  await requireAdmin(locale as Locale);
  const files = collectImageFiles(formData);

  const [existing] = await getDb()
    .select({
      id: products.id,
      status: products.status,
      translations: products.translations,
    })
    .from(products)
    .where(and(eq(products.id, productId), isNull(products.deletedAt)))
    .limit(1);

  if (!existing) {
    return err("NOT_FOUND", "Product not found.");
  }

  await getDb()
    .update(products)
    .set({
      sku: data.sku,
      priceAmount: data.priceAmount,
      compareAtAmount: data.compareAtAmount,
      status: data.status || existing.status,
      salesClass: data.salesClass,
      warrantyYears: data.warrantyYears,
      tags: parseProductTags(data.tags),
      translations: buildTranslations(data),
      updatedAt: new Date(),
    })
    .where(eq(products.id, existing.id));

  const categoryError = await syncProductCategories(
    existing.id,
    data.categoryIds,
  );
  if (categoryError) {
    return err("VALIDATION_ERROR", categoryError);
  }

  const brandError = await syncProductBrands(existing.id, data.brandIds);
  if (brandError) {
    return err("VALIDATION_ERROR", brandError);
  }

  const mediaResult = await persistProductMedia({
    productId: existing.id,
    files,
    primaryNewIndex: data.primaryNewIndex ?? null,
    primaryExistingId: data.primaryExistingId ?? null,
    removeImageIds: data.removeImageIds,
  });
  if (mediaResult.error) {
    return err("VALIDATION_ERROR", mediaResult.error);
  }

  const previousSlug =
    existing.translations.hy?.slug ??
    existing.translations.en?.slug ??
    existing.translations.ru?.slug;

  revalidateProducts(locale, {
    id: existing.id,
    slug: data.slug,
    previousSlug,
  });
  return ok({ id: existing.id });
}
