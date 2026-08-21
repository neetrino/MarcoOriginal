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
    <section className="-mx-4 -my-10 bg-white px-4 pt-6 pb-24 sm:-mx-6 sm:px-6 md:pb-16 lg:-mx-8 lg:px-8 lg:pt-10">
      <BrandDirectory
        locale={rawLocale}
        title={dictionary.nav.brand}
        brands={brands}
        emptyLabel={dictionary.catalog.brandsEmpty}
      />
    </section>
  );
}
