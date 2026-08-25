export const PRODUCT_TYPES = ["SIMPLE", "VARIABLE"] as const;

export type ProductType = (typeof PRODUCT_TYPES)[number];

export function isProductType(value: string): value is ProductType {
  return (PRODUCT_TYPES as readonly string[]).includes(value);
}

/** Temporary: admin cannot create new VARIABLE products. */
export const VARIABLE_PRODUCT_TYPE_DISABLED = true;
