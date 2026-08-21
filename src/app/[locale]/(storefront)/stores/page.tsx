import { notFound } from "next/navigation";

import { buildContactLocations } from "@/features/contact/content/contact-locations";
import { orderStoreLocations } from "@/features/stores/content/store-directory";
import { StoresContactCta } from "@/features/stores/ui/StoresContactCta";
import { StoresGrid } from "@/features/stores/ui/StoresGrid";
import { StoresHero } from "@/features/stores/ui/StoresHero";
import {
  STORES_PAGE_SHELL_CLASS,
  STORES_SECTION_INNER_CLASS,
} from "@/features/stores/ui/stores-section-classes";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type StoresPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: StoresPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  const dictionary = getDictionary(locale);
  return { title: dictionary.stores.title };
}

export default async function StoresPage({ params }: StoresPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const locations = orderStoreLocations(
    buildContactLocations(dictionary.contact.locations),
  );

  return (
    <div className={STORES_PAGE_SHELL_CLASS}>
      <div className={STORES_SECTION_INNER_CLASS}>
        <StoresHero copy={dictionary.stores} />
        <StoresGrid locations={locations} copy={dictionary.stores} />
        <StoresContactCta locale={rawLocale} copy={dictionary.stores} />
      </div>
    </div>
  );
}
