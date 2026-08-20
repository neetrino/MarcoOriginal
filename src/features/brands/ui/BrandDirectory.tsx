import Image from "next/image";

import type { StorefrontBrandListItem } from "@/features/brands/types";

type BrandDirectoryProps = {
  brands: readonly StorefrontBrandListItem[];
  emptyLabel: string;
};

export function BrandDirectory({ brands, emptyLabel }: BrandDirectoryProps) {
  if (brands.length === 0) {
    return <p className="text-sm text-gray-600">{emptyLabel}</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {brands.map((brand) => (
        <li
          key={brand.id}
          className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white p-5"
        >
          <div className="relative flex h-24 w-full items-center justify-center overflow-hidden">
            {brand.imageUrl ? (
              <Image
                src={brand.imageUrl}
                alt={brand.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain"
              />
            ) : (
              <span className="text-sm text-gray-400">—</span>
            )}
          </div>
          <p className="text-center text-sm font-medium text-gray-900">
            {brand.title}
          </p>
        </li>
      ))}
    </ul>
  );
}
