import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import { ProductDrawerCatalogTab } from "@/features/products/ui/ProductDrawerCatalogTab";
import {
  ProductDrawerImages,
  type ProductDraftImage,
} from "@/features/products/ui/ProductDrawerImages";
import { ProductDrawerPriceTab } from "@/features/products/ui/ProductDrawerPriceTab";
import type { ProductDrawerTab } from "@/features/products/ui/ProductDrawerTabs";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerRestFieldsProps = {
  tab: ProductDrawerTab;
  copy: EditorCopy;
  images: ProductDraftImage[];
  categories: AdminCategoryOption[];
  categoryIds: string[];
  brands: readonly { id: string; title: string }[];
  brandIds: string[];
  priceAmount: string;
  discountPercent: string;
  sku: string;
  disabled: boolean;
  onImagesChange: (images: ProductDraftImage[]) => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onBrandIdsChange: (ids: string[]) => void;
  onPriceAmountChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  onSkuChange: (value: string) => void;
};

export function ProductDrawerRestFields({
  tab,
  copy,
  images,
  categories,
  categoryIds,
  brands,
  brandIds,
  priceAmount,
  discountPercent,
  sku,
  disabled,
  onImagesChange,
  onCategoryIdsChange,
  onBrandIdsChange,
  onPriceAmountChange,
  onDiscountPercentChange,
  onSkuChange,
}: ProductDrawerRestFieldsProps) {
  return (
    <>
      <div hidden={tab !== "media"} data-drawer-tab="media">
        <ProductDrawerImages
          images={images}
          disabled={disabled}
          onChange={onImagesChange}
        />
      </div>

      <div hidden={tab !== "catalog"} data-drawer-tab="catalog">
        <ProductDrawerCatalogTab
          copy={copy}
          categories={categories}
          categoryIds={categoryIds}
          brands={brands}
          brandIds={brandIds}
          disabled={disabled}
          onCategoryIdsChange={onCategoryIdsChange}
          onBrandIdsChange={onBrandIdsChange}
        />
      </div>

      <div hidden={tab !== "price"} data-drawer-tab="price">
        <ProductDrawerPriceTab
          copy={copy}
          priceAmount={priceAmount}
          discountPercent={discountPercent}
          sku={sku}
          disabled={disabled}
          onPriceAmountChange={onPriceAmountChange}
          onDiscountPercentChange={onDiscountPercentChange}
          onSkuChange={onSkuChange}
        />
      </div>
    </>
  );
}
