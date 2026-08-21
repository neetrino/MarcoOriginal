import "server-only";

import { and, eq, inArray, isNull } from "drizzle-orm";

import { getDb } from "@/db/client";
import { brands, categories, productBrands, productCategories } from "@/db/schema";
import { createId } from "@/lib/id";

/** Replaces product-category links. First selected id is primary. */
export async function syncProductCategories(
  productId: string,
  categoryIds: string[],
): Promise<string | null> {
  const uniqueIds = [...new Set(categoryIds)];
  if (uniqueIds.length > 0) {
    const found = await getDb()
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(inArray(categories.id, uniqueIds), isNull(categories.deletedAt)),
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

/** Replaces product-brand links. First selected id is primary. */
export async function syncProductBrands(
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
