"use client";

import { useRef } from "react";
import Image from "next/image";

import { ADMIN_LABEL } from "@/features/admin/ui/admin-form-classes";

type AdminHeroImageFieldProps = {
  label: string;
  hint: string;
  previewUrl: string | null;
  disabled: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

export function AdminHeroImageField({
  label,
  hint,
  previewUrl,
  disabled,
  onSelect,
  onRemove,
}: AdminHeroImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <span className={ADMIN_LABEL}>{label}</span>
      <p className="mt-0.5 text-xs text-gray-500">{hint}</p>
      <div className="mt-1 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center rounded-xl border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-50"
        >
          {previewUrl ? "Change Image" : "+ Upload Image"}
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
            if (file) onSelect(file);
          }}
        />
        {previewUrl ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onRemove}
            className="text-sm font-medium text-gray-600 hover:text-red-600"
          >
            Remove
          </button>
        ) : null}
      </div>
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt=""
          width={112}
          height={112}
          className="mt-3 h-28 w-28 rounded-xl border border-gray-200 object-cover"
          unoptimized={previewUrl.startsWith("blob:")}
        />
      ) : null}
    </div>
  );
}
