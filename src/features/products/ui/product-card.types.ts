/** Shared storefront product tile data — home, catalog, PDP related. */
export type ProductCardItem = {
  id: string;
  href: string;
  title: string;
  skuLine?: string | null;
  priceFormatted: string;
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
