"use client";

import { useEffect } from "react";
import Image from "next/image";

type HeroBannerImageLightboxProps = {
  url: string;
  label: string;
  onClose: () => void;
  onReplace: () => void;
};

export function HeroBannerImageLightbox({
  url,
  label,
  onClose,
  onReplace,
}: HeroBannerImageLightboxProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent): void {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center gap-4"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
          aria-label="Close"
        >
          <svg
            className="h-4 w-4 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <Image
          src={url}
          alt={label}
          width={1600}
          height={900}
          className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          unoptimized
        />

        <button
          type="button"
          onClick={() => {
            onClose();
            onReplace();
          }}
          className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-gray-800 shadow-lg hover:bg-gray-50"
        >
          Change image
        </button>
      </div>
    </div>
  );
}
