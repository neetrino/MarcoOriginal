"use client";

import { useRef } from "react";
import Image from "next/image";

import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type CategoriesCopy = Dictionary["admin"]["categories"];

type CategoryDrawerImageFieldProps = {
  copy: CategoriesCopy;
  imagePreview: string | null;
  disabled: boolean;
  onFileChange: (file: File | null) => void;
  onRemove: () => void;
};

export function CategoryDrawerImageField({
  copy,
  imagePreview,
  disabled,
  onFileChange,
  onRemove,
}: CategoryDrawerImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className={ADMIN_LABEL}>{copy.image}</span>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          {imagePreview ? copy.changeImage : copy.uploadImage}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            event.target.value = "";
            onFileChange(file);
          }}
        />
        {imagePreview ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            {copy.removeImage}
          </button>
        ) : null}
      </div>
      {imagePreview ? (
        <Image
          src={imagePreview}
          alt=""
          width={112}
          height={112}
          className="mt-3 h-28 w-28 rounded-xl border border-gray-200 object-cover"
          unoptimized={imagePreview.startsWith("blob:")}
        />
      ) : null}
    </div>
  );
}
