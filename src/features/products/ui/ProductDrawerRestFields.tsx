import type { AdminCategoryOption } from "@/features/products/application/list-admin-products";
import { ProductDrawerCategories } from "@/features/products/ui/ProductDrawerCategories";
import {
  ProductDrawerImages,
  type ProductDraftImage,
} from "@/features/products/ui/ProductDrawerImages";
import { ProductDrawerPriceTab } from "@/features/products/ui/ProductDrawerPriceTab";
import type { ProductDrawerTab } from "@/features/products/ui/ProductDrawerTabs";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type EditorCopy = Dictionary["admin"]["productEditor"];

type ProductDrawerRestFieldsProps = {
  locale: string;
  tab: ProductDrawerTab;
  copy: EditorCopy;
  images: ProductDraftImage[];
  categories: AdminCategoryOption[];
  categoryIds: string[];
  priceAmount: string;
  discountPercent: string;
  sku: string;
  disabled: boolean;
  onImagesChange: (images: ProductDraftImage[]) => void;
  onCategoriesChange: (categories: AdminCategoryOption[]) => void;
  onCategoryIdsChange: (ids: string[]) => void;
  onPriceAmountChange: (value: string) => void;
  onDiscountPercentChange: (value: string) => void;
  onSkuChange: (value: string) => void;
};

export function ProductDrawerRestFields({
  locale,
  tab,
  copy,
  images,
  categories,
  categoryIds,
  priceAmount,
  discountPercent,
  sku,
  disabled,
  onImagesChange,
  onCategoriesChange,
  onCategoryIdsChange,
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
        <ProductDrawerCategories
          locale={locale}
          categories={categories}
          selectedIds={categoryIds}
          disabled={disabled}
          copy={{
            label: copy.categoriesLabel,
            placeholder: copy.categoriesPlaceholder,
            empty: copy.categoriesEmpty,
            add: copy.addCategory,
            titleLabel: copy.categoryTitleLabel,
            titlePlaceholder: copy.categoryTitlePlaceholder,
            addSubmit: copy.categoryAddSubmit,
            adding: copy.categoryAdding,
            cancel: copy.cancel,
          }}
          onCategoriesChange={onCategoriesChange}
          onSelectedChange={onCategoryIdsChange}
        />
      </div>

      <div hidden={tab !== "price"} data-drawer-tab="price">
        <ProductDrawerPriceTab
          locale={locale}
          copy={copy}
          priceAmount={priceAmount}
          discountPercent={discountPercent}
          sku={sku}
          categories={categories}
          categoryIds={categoryIds}
          disabled={disabled}
          onPriceAmountChange={onPriceAmountChange}
          onDiscountPercentChange={onDiscountPercentChange}
          onSkuChange={onSkuChange}
          onCategoriesChange={onCategoriesChange}
          onCategoryIdsChange={onCategoryIdsChange}
        />
      </div>
    </>
  );
}
