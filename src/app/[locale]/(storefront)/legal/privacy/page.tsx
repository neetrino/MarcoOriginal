import { notFound } from "next/navigation";

import { PolicyPageShell } from "@/features/legal/ui/PolicyPageShell";
import { PrivacyPolicyContent } from "@/features/privacy/ui/PrivacyPolicyContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).privacy.title };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <PolicyPageShell>
      <PrivacyPolicyContent copy={dictionary.privacy} />
    </PolicyPageShell>
  );
}
