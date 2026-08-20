"use client";

import Image from "next/image";

import type { ProductGalleryImage } from "@/features/products/types";

type GalleryThumbsProps = {
  images: ProductGalleryImage[];
  selectedId: string | null;
  title: string;
  onSelect: (id: string) => void;
};

export function GalleryDesktopThumbs({
  images,
  selectedId,
  title,
  onSelect,
}: GalleryThumbsProps) {
  if (images.length === 0) return null;
  return (
    <div className="hidden w-28 shrink-0 flex-col gap-4 md:flex">
      {images.map((image) => (
        <GalleryThumb
          key={image.id}
          image={image}
          title={title}
          isActive={image.id === selectedId}
          className="aspect-[3/4] w-full"
          onSelect={() => onSelect(image.id)}
        />
      ))}
    </div>
  );
}

export function GalleryMobileThumbs({
  images,
  selectedId,
  title,
  onSelect,
}: GalleryThumbsProps) {
  if (images.length <= 1) return null;
  return (
    <div className="md:hidden">
      <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full justify-center gap-3 px-1">
          {images.map((image) => (
            <GalleryThumb
              key={image.id}
              image={image}
              title={title}
              isActive={image.id === selectedId}
              className="aspect-[3/4] w-[58px] shrink-0"
              onSelect={() => onSelect(image.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryThumb({
  image,
  title,
  isActive,
  className,
  onSelect,
}: {
  image: ProductGalleryImage;
  title: string;
  isActive: boolean;
  className: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={image.alt || title}
      aria-pressed={isActive}
      className={`relative overflow-hidden rounded-lg border bg-white transition ${className} ${
        isActive
          ? "border-[3px] border-marco-yellow"
          : "border-gray-200 hover:border-gray-300 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
      }`}
    >
      <Image src={image.url} alt="" fill sizes="112px" className="object-cover" />
    </button>
  );
}
