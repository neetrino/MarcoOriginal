"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { HeroBannerImageLightbox } from "@/features/hero/ui/HeroBannerImageLightbox";

type HeroBannerImageFieldProps = {
  label: string;
  currentUrl: string | null;
  uploading: boolean;
  disabled: boolean;
  previewClassName: string;
  previewRadiusClassName: string;
  fillCell?: boolean;
  onUpload: (file: File) => void | Promise<void>;
  onRemove?: () => void | Promise<void>;
};

export function HeroBannerImageField({
  label,
  currentUrl,
  uploading,
  disabled,
  previewClassName,
  previewRadiusClassName,
  fillCell = false,
  onUpload,
  onRemove,
}: HeroBannerImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const hasImage = Boolean(currentUrl?.trim());

  function openFilePicker(): void {
    inputRef.current?.click();
  }

  const frameClassName = fillCell
    ? `group relative h-full min-h-0 w-full overflow-hidden ${previewRadiusClassName}`
    : `group relative w-full overflow-hidden ${previewRadiusClassName} ${previewClassName}`;
  const emptyClassName = fillCell
    ? `absolute inset-0 flex h-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-gray-300/80 bg-gray-100/60 text-gray-500 transition hover:border-amber-300 hover:bg-amber-50/50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${previewRadiusClassName}`
    : `flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-gray-300/80 bg-gray-100/60 text-gray-500 transition hover:border-amber-300 hover:bg-amber-50/50 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 ${previewClassName} ${previewRadiusClassName}`;

  return (
    <>
      {lightboxOpen && hasImage && currentUrl ? (
        <HeroBannerImageLightbox
          url={currentUrl}
          label={label}
          onClose={() => setLightboxOpen(false)}
          onReplace={openFilePicker}
        />
      ) : null}

      <div
        className={`group ${fillCell ? "h-full min-h-0" : "w-full"}`}
        aria-label={label}
      >
        <div className={frameClassName}>
          {hasImage && currentUrl ? (
            <HeroBannerFilledPreview
              url={currentUrl}
              label={label}
              radiusClassName={previewRadiusClassName}
              uploading={uploading}
              disabled={disabled}
              onChangeImage={openFilePicker}
              onViewFullSize={() => setLightboxOpen(true)}
              onRemove={onRemove}
            />
          ) : (
            <button
              type="button"
              disabled={disabled}
              onClick={openFilePicker}
              className={emptyClassName}
            >
              {uploading ? (
                <>
                  <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-amber-500" />
                  <span className="text-sm font-medium">Uploading…</span>
                </>
              ) : (
                <>
                  <svg
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  <span className="text-sm font-medium">Click to upload</span>
                </>
              )}
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            disabled={disabled}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void onUpload(file);
            }}
          />
        </div>
      </div>
    </>
  );
}

type HeroBannerFilledPreviewProps = {
  url: string;
  label: string;
  radiusClassName: string;
  uploading: boolean;
  disabled: boolean;
  onChangeImage: () => void;
  onViewFullSize: () => void;
  onRemove?: () => void | Promise<void>;
};

function HeroBannerFilledPreview({
  url,
  label,
  radiusClassName,
  uploading,
  disabled,
  onChangeImage,
  onViewFullSize,
  onRemove,
}: HeroBannerFilledPreviewProps) {
  const overlayClass = `absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/45 px-4 opacity-0 backdrop-blur-[2px] transition duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${radiusClassName} ${uploading ? "opacity-100" : ""}`;
  const previewSizes = "(max-width: 1024px) 100vw, 480px";

  return (
    <div className="absolute inset-0">
      <Image
        src={url}
        alt={label}
        fill
        sizes={previewSizes}
        className="object-cover transition duration-200 group-hover:scale-[1.01] group-hover:brightness-[0.92]"
        unoptimized={url.startsWith("blob:")}
      />
      <div className={overlayClass} aria-hidden={!uploading}>
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-amber-400" />
            <span className="text-sm font-medium">Uploading…</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onChangeImage();
              }}
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg shadow-amber-500/30 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Change image
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onViewFullSize();
              }}
              className="text-xs font-medium text-white/90 underline-offset-2 transition hover:text-white hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            >
              View full size
            </button>
            {onRemove ? (
              <button
                type="button"
                disabled={disabled}
                onClick={(event) => {
                  event.stopPropagation();
                  void onRemove();
                }}
                className="text-xs font-medium text-red-200 transition hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove image
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
