import { useState } from "react";

import type {
  AdminCategoryOption,
  AdminProductListItem,
} from "@/features/products/application/list-admin-products";
import {
  createDraftProductTag,
  type ProductSalesClass,
  type ProductTag,
  type ProductWarrantyYears,
} from "@/features/products/domain/product-presentation";
import { discountPercentFromCompareAt } from "@/features/products/domain/product-discount";
import {
  createDraftProductSpec,
  slugifyProductTitle,
  type ProductSpecification,
} from "@/features/products/domain/product-specs";
import type { ProductDraftImage } from "@/features/products/ui/ProductDrawerImages";
import type { ProductDrawerTab } from "@/features/products/ui/ProductDrawerTabs";

type DrawerProduct = Pick<
  AdminProductListItem,
  | "id"
  | "sku"
  | "title"
  | "slug"
  | "description"
  | "priceAmount"
  | "compareAtAmount"
  | "stockOnHand"
  | "status"
  | "categoryIds"
  | "images"
  | "salesClass"
  | "warrantyYears"
  | "tags"
  | "specifications"
>;

function imagesFromProduct(product: DrawerProduct | null): ProductDraftImage[] {
  if (!product) return [];
  return product.images.map((image) => ({
    key: image.id,
    previewUrl: image.url,
    isPrimary: image.isPrimary,
    existingId: image.id,
  }));
}

export function useProductDrawerForm(args: {
  product: DrawerProduct | null;
  initialCategories: AdminCategoryOption[];
}) {
  const { product, initialCategories } = args;
  const [tab, setTab] = useState<ProductDrawerTab>("basics");
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<ProductDraftImage[]>(() =>
    imagesFromProduct(product),
  );
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [categories, setCategories] =
    useState<AdminCategoryOption[]>(initialCategories);
  const [categoryIds, setCategoryIds] = useState<string[]>(
    product?.categoryIds ?? [],
  );
  const [priceAmount, setPriceAmount] = useState(
    product ? String(product.priceAmount) : "",
  );
  const [discountPercent, setDiscountPercent] = useState(
    product
      ? String(
          discountPercentFromCompareAt(
            product.priceAmount,
            product.compareAtAmount,
          ),
        )
      : "0",
  );
  const [sku, setSku] = useState(product?.sku ?? "");
  const [salesClass, setSalesClass] = useState<ProductSalesClass>(
    product?.salesClass ?? "RETAIL",
  );
  const [warrantyYears, setWarrantyYears] = useState<ProductWarrantyYears>(
    product?.warrantyYears ?? 0,
  );
  const [tags, setTags] = useState<ProductTag[]>(() =>
    product && product.tags.length > 0
      ? product.tags
      : [createDraftProductTag()],
  );
  const [specifications, setSpecifications] = useState<ProductSpecification[]>(
    () =>
      product && product.specifications.length > 0
        ? product.specifications
        : [createDraftProductSpec()],
  );
  const [slugTouched] = useState(product != null);
  const [error, setError] = useState<string | null>(null);

  function handleImagesChange(next: ProductDraftImage[]): void {
    const nextKeys = new Set(next.map((image) => image.key));
    const removedExisting = images
      .filter(
        (image) =>
          image.existingId &&
          !nextKeys.has(image.key) &&
          !removedImageIds.includes(image.existingId),
      )
      .map((image) => image.existingId as string);
    if (removedExisting.length > 0) {
      setRemovedImageIds((prev) => [...prev, ...removedExisting]);
    }
    setImages(next);
  }

  function handleTitleChange(value: string): void {
    setTitle(value);
  }

  const resolvedSlug = slugTouched ? slug : slugifyProductTitle(title);

  return {
    tab,
    setTab,
    title,
    slug: resolvedSlug,
    setSlug,
    description,
    setDescription,
    images,
    removedImageIds,
    categories,
    setCategories,
    categoryIds,
    setCategoryIds,
    priceAmount,
    setPriceAmount,
    discountPercent,
    setDiscountPercent,
    sku,
    setSku,
    salesClass,
    setSalesClass,
    warrantyYears,
    setWarrantyYears,
    tags,
    setTags,
    specifications,
    setSpecifications,
    error,
    setError,
    handleImagesChange,
    handleTitleChange,
  };
}
