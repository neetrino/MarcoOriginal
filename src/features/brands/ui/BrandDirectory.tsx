import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import type { StorefrontBrandListItem } from "@/features/brands/types";
import { CatalogPageTitle } from "@/features/products/ui/CatalogPageTitle";

const BRANDS_CARD_MIN_HEIGHT_PX = 152;
const BRANDS_LOGO_HEIGHT_PX = 96;

type BrandDirectoryProps = {
  locale: string;
  title: string;
  brands: readonly StorefrontBrandListItem[];
  emptyLabel: string;
};

export function BrandDirectory({
  locale,
  title,
  brands,
  emptyLabel,
}: BrandDirectoryProps) {
  if (brands.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <CatalogPageTitle title={title} />
        <p className="text-sm text-gray-600">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <CatalogPageTitle title={title} />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {brands.map((brand, index) => (
          <li key={brand.id}>
            <BrandDirectoryCard
              brand={brand}
              locale={locale}
              imagePriority={index < 6}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrandDirectoryCard({
  brand,
  locale,
  imagePriority,
}: {
  brand: StorefrontBrandListItem;
  locale: string;
  imagePriority: boolean;
}) {
  const href = brand.slug
    ? `/${locale}/products?brand=${encodeURIComponent(brand.slug)}`
    : `/${locale}/products`;

  return (
    <AppLink
      href={href}
      prefetchPolicy="intent"
      aria-label={brand.title}
      className="flex w-full items-center justify-center rounded-2xl border border-[#e2e8f0] bg-white px-4 py-5 transition-colors hover:border-marco-ink/30 hover:bg-[#f8f8f8] sm:px-5 sm:py-6"
      style={{ minHeight: BRANDS_CARD_MIN_HEIGHT_PX }}
    >
      <div
        className="relative mx-auto w-full max-w-[264px]"
        style={{ height: BRANDS_LOGO_HEIGHT_PX }}
      >
        {brand.imageUrl ? (
          <Image
            src={brand.imageUrl}
            alt={brand.title}
            fill
            priority={imagePriority}
            sizes="(max-width: 640px) 50vw, 33vw"
            className="object-contain"
          />
        ) : (
          <span className="flex h-full items-center justify-center text-center text-sm font-semibold uppercase text-marco-slate">
            {brand.title}
          </span>
        )}
      </div>
    </AppLink>
  );
}
