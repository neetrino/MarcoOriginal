"use client";

import { useTransition, type FormEvent, type InvalidEvent } from "react";
import { useRouter } from "next/navigation";

import { SideSheet } from "@/components/ui/SideSheet";
import type {
  AdminCategoryOption,
  AdminProductListItem,
} from "@/features/products/application/list-admin-products";
import {
  createProductFromDrawerAction,
  updateProductFromDrawerAction,
} from "@/features/products/application/upsert-product";
import { parseProductTags } from "@/features/products/domain/product-presentation";
import { compareAtFromDiscountPercent } from "@/features/products/domain/product-discount";
import {
  parseProductSpecs,
  slugifyProductTitle,
} from "@/features/products/domain/product-specs";
import { ProductDrawerBasicsTab } from "@/features/products/ui/ProductDrawerBasicsTab";
import { ProductDrawerDescriptionTab } from "@/features/products/ui/ProductDrawerDescriptionTab";
import { ProductDrawerHeader } from "@/features/products/ui/ProductDrawerHeader";
import { ProductDrawerRestFields } from "@/features/products/ui/ProductDrawerRestFields";
import {
  ProductDrawerTabs,
  type ProductDrawerTab,
} from "@/features/products/ui/ProductDrawerTabs";
import { useProductDrawerForm } from "@/features/products/ui/use-product-drawer-form";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";

type ProductDrawerProduct = Pick<
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
  | "brandIds"
  | "images"
  | "salesClass"
  | "warrantyYears"
  | "tags"
  | "specifications"
>;

type ProductDrawerProps = {
  locale: string;
  open: boolean;
  onClose: () => void;
  product?: ProductDrawerProduct | null;
  categories: AdminCategoryOption[];
  brands: readonly { id: string; title: string }[];
};;

function tabFromInvalidTarget(target: EventTarget | null): ProductDrawerTab | null {
  if (!(target instanceof HTMLElement)) return null;
  const tab = target.closest("[data-drawer-tab]")?.getAttribute("data-drawer-tab");
  if (
    tab === "basics" ||
    tab === "description" ||
    tab === "media" ||
    tab === "catalog" ||
    tab === "price"
  ) {
    return tab;
  }
  return null;
}

export function ProductDrawer({
  locale,
  open,
  onClose,
  product = null,
  categories,
  brands,
}: ProductDrawerProps) {
  const copy = isLocale(locale)
    ? getDictionary(locale).admin.productEditor
    : getDictionary("hy").admin.productEditor;
  const formKey = open ? (product?.id ?? "new") : "closed";

  return (
    <SideSheet
      open={open}
      onClose={onClose}
      ariaLabel={copy.title}
      panelClassName="w-[min(100%,80rem)]"
    >
      <ProductDrawerForm
        key={formKey}
        locale={locale}
        product={product}
        categories={categories}
        brands={brands}
        copy={copy}
        onClose={onClose}
      />
    </SideSheet>
  );
}

function ProductDrawerForm({
  locale,
  product,
  categories: initialCategories,
  brands,
  copy,
  onClose,
}: {
  locale: string;
  product: ProductDrawerProduct | null;
  categories: AdminCategoryOption[];
  brands: readonly { id: string; title: string }[];
  copy: Dictionary["admin"]["productEditor"];
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = product != null;
  const form = useProductDrawerForm({
    product,
    initialCategories,
  });
  const [isPending, startTransition] = useTransition();

  function handleInvalid(event: InvalidEvent<HTMLFormElement>): void {
    const nextTab = tabFromInvalidTarget(event.target);
    if (nextTab) form.setTab(nextTab);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const newImages = form.images.filter((image) => image.file);
    const primaryImage = form.images.find((image) => image.isPrimary);
    const primaryNewIndex = primaryImage?.file
      ? newImages.findIndex((image) => image.key === primaryImage.key)
      : null;

    const payload = {
      sku: form.sku.trim(),
      title: form.title.trim(),
      slug: form.slug.trim() || slugifyProductTitle(form.title),
      description: form.description,
      specifications: parseProductSpecs(form.specifications),
      priceAmount: Number(form.priceAmount),
      compareAtAmount: compareAtFromDiscountPercent(
        Number(form.priceAmount),
        Number(form.discountPercent),
      ),
      categoryIds: form.categoryIds,
      brandIds: form.brandIds,
      status: (product?.status === "ACTIVE" || product?.status === "ARCHIVED"
        ? product.status
        : "DRAFT") as "DRAFT" | "ACTIVE" | "ARCHIVED",
      salesClass: form.salesClass,
      warrantyYears: form.warrantyYears,
      tags: parseProductTags(form.tags),
      primaryExistingId: primaryImage?.existingId ?? null,
      primaryNewIndex:
        primaryNewIndex != null && primaryNewIndex >= 0
          ? primaryNewIndex
          : null,
      removeImageIds: form.removedImageIds,
    };

    const formData = new FormData();
    formData.set("data", JSON.stringify(payload));
    for (const image of newImages) {
      if (image.file) formData.append("images", image.file);
    }

    startTransition(async () => {
      form.setError(null);
      const result =
        isEdit && product
          ? await updateProductFromDrawerAction(locale, product.id, formData)
          : await createProductFromDrawerAction(locale, formData);
      if (!result.ok) {
        form.setError(result.error.message);
        return;
      }
      onClose();
      router.refresh();
    });
  }

  const submitLabel = isPending
    ? isEdit
      ? copy.saving
      : copy.creating
    : isEdit
      ? copy.saveProduct
      : copy.addProduct;

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={handleSubmit}
      onInvalid={handleInvalid}
    >
        <ProductDrawerHeader
          editorLabel={copy.title}
          title={form.title}
          titlePlaceholder={copy.titlePlaceholder}
          slug={form.slug}
          slugPlaceholder={copy.slugPlaceholder}
          cancelLabel={copy.cancel}
          submitLabel={submitLabel}
          disabled={isPending}
          onTitleChange={form.handleTitleChange}
          onCancel={onClose}
        />

        <div className="flex min-h-0 flex-1">
          <ProductDrawerTabs
            active={form.tab}
            onChange={form.setTab}
            labels={{
              basics: copy.tabBasics,
              description: copy.tabDescription,
              media: copy.tabMedia,
              catalog: copy.tabCatalog,
              price: copy.tabPrice,
            }}
          />

          <div className="min-h-0 flex-1 overflow-y-auto bg-slate-50/70 px-6 py-6">
            <div hidden={form.tab !== "basics"} data-drawer-tab="basics">
              <ProductDrawerBasicsTab
                salesClass={form.salesClass}
                warrantyYears={form.warrantyYears}
                tags={form.tags}
                disabled={isPending}
                copy={copy}
                onSalesClassChange={form.setSalesClass}
                onWarrantyYearsChange={form.setWarrantyYears}
                onTagsChange={form.setTags}
              />
            </div>

            <div hidden={form.tab !== "description"} data-drawer-tab="description">
              <ProductDrawerDescriptionTab
                description={form.description}
                specifications={form.specifications}
                disabled={isPending}
                copy={copy}
                onDescriptionChange={form.setDescription}
                onSpecificationsChange={form.setSpecifications}
              />
            </div>

            <ProductDrawerRestFields
              tab={form.tab}
              copy={copy}
              images={form.images}
              categories={form.categories}
              categoryIds={form.categoryIds}
              brands={brands}
              brandIds={form.brandIds}
              priceAmount={form.priceAmount}
              discountPercent={form.discountPercent}
              sku={form.sku}
              disabled={isPending}
              onImagesChange={form.handleImagesChange}
              onCategoryIdsChange={form.setCategoryIds}
              onBrandIdsChange={form.setBrandIds}
              onPriceAmountChange={form.setPriceAmount}
              onDiscountPercentChange={form.setDiscountPercent}
              onSkuChange={form.setSku}
            />

            {form.error ? (
              <p className="mt-4 text-sm text-red-700">{form.error}</p>
            ) : null}
          </div>
        </div>
      </form>
    );
}
