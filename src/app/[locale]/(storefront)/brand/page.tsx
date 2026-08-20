import { notFound } from "next/navigation";

import { listStorefrontBrands } from "@/features/brands/application/list-storefront-brands";
import { BrandDirectory } from "@/features/brands/ui/BrandDirectory";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type BrandPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BrandPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  return { title: dictionary.nav.brand };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const brands = await listStorefrontBrands(rawLocale);

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
        {dictionary.nav.brand}
      </h1>
      <BrandDirectory
        brands={brands}
        emptyLabel={dictionary.catalog.brandsEmpty}
      />
    </section>
  );
}
