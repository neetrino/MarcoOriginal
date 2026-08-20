export const MAX_COMPARE_PRODUCTS = 4;
export const COMPARE_COOKIE_NAME = "ws_compare";
export const COMPARE_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ToggleCompareStatus = "added" | "removed" | "limit";

export type ToggleCompareResult = {
  ids: string[];
  inCompare: boolean;
  status: ToggleCompareStatus;
};

function isProductId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/** Parses the compare cookie into a de-duplicated, bounded product-id list. */
export function parseCompareProductIds(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const ids: string[] = [];
    for (const value of parsed) {
      if (typeof value !== "string" || !isProductId(value)) {
        continue;
      }
      if (ids.includes(value)) {
        continue;
      }
      ids.push(value);
      if (ids.length >= MAX_COMPARE_PRODUCTS) {
        break;
      }
    }
    return ids;
  } catch {
    return [];
  }
}

export function serializeCompareProductIds(ids: readonly string[]): string {
  return JSON.stringify(ids.slice(0, MAX_COMPARE_PRODUCTS));
}

/** Adds or removes a product, respecting the max compare size. */
export function toggleCompareProductId(
  ids: readonly string[],
  productId: string,
): ToggleCompareResult {
  if (ids.includes(productId)) {
    return {
      ids: ids.filter((id) => id !== productId),
      inCompare: false,
      status: "removed",
    };
  }

  if (ids.length >= MAX_COMPARE_PRODUCTS) {
    return { ids: [...ids], inCompare: false, status: "limit" };
  }

  return {
    ids: [...ids, productId],
    inCompare: true,
    status: "added",
  };
}

export function removeCompareProductId(
  ids: readonly string[],
  productId: string,
): string[] {
  return ids.filter((id) => id !== productId);
}
