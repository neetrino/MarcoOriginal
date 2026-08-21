import type { ProductTag } from "@/db/schema";

type LocaleTranslation = {
  title: string;
  slug: string;
  description?: string;
  specifications?: Array<{ title: string; value: string }>;
  seoTitle?: string;
  seoDescription?: string;
};

export type CatalogProduct = {
  id: string;
  sku: string;
  /** Catalog list price before automatic discount. */
  listPriceAmount: number;
  /** Customer-facing unit price after automatic discount. */
  priceAmount: number;
  compareAtAmount: number | null;
  discountPercent: number | null;
  stockOnHand: number;
  translation: LocaleTranslation;
  imageUrl: string | null;
  brandLogoUrl: string | null;
  warrantyYears: number;
  tags: ProductTag[];
};

export type ProductGalleryImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
};

export type ProductCategoryRef = {
  id: string;
  title: string;
  slug: string;
};

export type ProductDetail = CatalogProduct & {
  images: ProductGalleryImage[];
  categories: ProductCategoryRef[];
};
