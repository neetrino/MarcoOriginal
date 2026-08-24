import { notFound } from "next/navigation";

import { PolicyPageShell } from "@/features/legal/ui/PolicyPageShell";
import { TermsContent } from "@/features/terms/ui/TermsContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).terms.title };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <PolicyPageShell>
      <TermsContent copy={dictionary.terms} />
    </PolicyPageShell>
  );
}
