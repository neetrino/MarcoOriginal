"use client";

import { CategoryDrawerImageField } from "@/features/categories/ui/CategoryDrawerImageField";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CategoriesCopy = Dictionary["admin"]["categories"];

type CategoryDrawerMediaFieldsProps = {
  copy: CategoriesCopy;
  showBanner: boolean;
  imagePreview: string | null;
  bannerPreview: string | null;
  disabled: boolean;
  onImageFileChange: (file: File | null) => void;
  onImageRemove: () => void;
  onBannerFileChange: (file: File | null) => void;
  onBannerRemove: () => void;
};

export function CategoryDrawerMediaFields({
  copy,
  showBanner,
  imagePreview,
  bannerPreview,
  disabled,
  onImageFileChange,
  onImageRemove,
  onBannerFileChange,
  onBannerRemove,
}: CategoryDrawerMediaFieldsProps) {
  return (
    <>
      <CategoryDrawerImageField
        label={copy.image}
        uploadLabel={copy.uploadImage}
        changeLabel={copy.changeImage}
        removeLabel={copy.removeImage}
        imagePreview={imagePreview}
        disabled={disabled}
        onFileChange={onImageFileChange}
        onRemove={onImageRemove}
      />
      {showBanner ? (
        <CategoryDrawerImageField
          label={copy.bannerImage}
          uploadLabel={copy.uploadBannerImage}
          changeLabel={copy.changeBannerImage}
          removeLabel={copy.removeBannerImage}
          imagePreview={bannerPreview}
          disabled={disabled}
          previewClassName="mt-3 h-28 w-48 rounded-xl border border-gray-200 object-cover"
          onFileChange={onBannerFileChange}
          onRemove={onBannerRemove}
        />
      ) : null}
    </>
  );
}
