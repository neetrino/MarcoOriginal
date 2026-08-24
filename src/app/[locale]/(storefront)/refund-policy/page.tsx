import { notFound } from "next/navigation";

import { PolicyPageShell } from "@/features/legal/ui/PolicyPageShell";
import { RefundPolicyContent } from "@/features/refund-policy/ui/RefundPolicyContent";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type RefundPolicyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: RefundPolicyPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).refundPolicy.title };
}

export default async function RefundPolicyPage({
  params,
}: RefundPolicyPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <PolicyPageShell>
      <RefundPolicyContent copy={dictionary.refundPolicy} />
    </PolicyPageShell>
  );
}
