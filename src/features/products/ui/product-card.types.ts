/** Shared storefront product tile data — home, catalog, PDP related. */
export type ProductCardItem = {
  id: string;
  href: string;
  title: string;
  skuLine?: string | null;
  /** Null when the product has no list price (`priceAmount` is 0). */
  priceFormatted: string | null;
  compareAtFormatted?: string | null;
  discountPercent?: number | null;
  imageUrl: string | null;
  brandLogoUrl?: string | null;
  brandName?: string | null;
  inStock: boolean;
  inWishlist?: boolean;
  inCompare?: boolean;
  warrantyYears?: number | null;
  warrantyYearsSuffix?: string | null;
  warrantyYearsLabel?: string | null;
  warrantyCaption?: string | null;
};

export type ProductCardLayout = "default" | "mobileGrid";
