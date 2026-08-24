import { notFound } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { DeliveryReturnContent } from "@/features/delivery-return/ui/DeliveryReturnContent";
import {
  POLICY_DELIVERY_CARD_CLASS,
  POLICY_DELIVERY_CARD_WRAP_CLASS,
  POLICY_TITLE_CLASS,
} from "@/features/legal/ui/policy-page.classes";
import { PolicyPageShell } from "@/features/legal/ui/PolicyPageShell";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type DeliveryReturnPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: DeliveryReturnPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {};
  }

  return { title: getDictionary(locale).deliveryReturn.title };
}

export default async function DeliveryReturnPage({
  params,
}: DeliveryReturnPageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const dictionary = getDictionary(rawLocale);

  return (
    <PolicyPageShell variant="delivery">
      <h1 className={POLICY_TITLE_CLASS}>{dictionary.deliveryReturn.title}</h1>
      <div className={POLICY_DELIVERY_CARD_WRAP_CLASS}>
        <Card className={POLICY_DELIVERY_CARD_CLASS}>
          <DeliveryReturnContent copy={dictionary.deliveryReturn} />
        </Card>
      </div>
    </PolicyPageShell>
  );
}
