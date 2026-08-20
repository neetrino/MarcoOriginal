import { notFound } from "next/navigation";

import { AboutHero } from "@/features/about/ui/AboutHero";
import { AboutPartners } from "@/features/about/ui/AboutPartners";
import { ABOUT_PAGE_SHELL_CLASS } from "@/features/about/ui/about-section-classes";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <div className={ABOUT_PAGE_SHELL_CLASS}>
      <AboutHero copy={dictionary.about} />
      <AboutPartners copy={dictionary.about} />
    </div>
  );
}
