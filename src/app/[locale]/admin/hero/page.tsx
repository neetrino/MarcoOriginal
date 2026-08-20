import { notFound } from "next/navigation";

import { ensureHeroLayoutSlides } from "@/features/hero/application/ensure-hero-layout";
import { listAdminHeroSlides } from "@/features/hero/application/queries";
import { AdminHeroView } from "@/features/hero/ui/AdminHeroView";
import { isLocale } from "@/lib/i18n/config";

type AdminHeroPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminHeroPage({ params }: AdminHeroPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  await ensureHeroLayoutSlides();
  const slides = await listAdminHeroSlides();

  return <AdminHeroView locale={locale} slides={slides} />;
}

