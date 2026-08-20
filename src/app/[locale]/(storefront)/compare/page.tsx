import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { listComparePageView } from "@/features/compare/queries";
import { CompareView } from "@/features/compare/ui/CompareView";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import {
  createDisplayPriceFormatter,
  getSelectedCurrency,
} from "@/lib/money/display-price";

type ComparePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  return { title: getDictionary(rawLocale).nav.compare };
}

export default async function ComparePage({ params }: ComparePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);
  const currency = await getSelectedCurrency();
  const formatPrice = await createDisplayPriceFormatter(rawLocale, currency);
  const view = await listComparePageView(rawLocale, formatPrice);

  return <CompareView view={view} labels={dictionary.compare} />;
}
