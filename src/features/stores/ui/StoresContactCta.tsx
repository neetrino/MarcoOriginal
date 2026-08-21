import { AppLink } from "@/components/ui/AppLink";
import { STORES_CONTACT_CTA_CLASS } from "@/features/stores/ui/stores-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type StoresContactCtaProps = {
  locale: Locale;
  copy: Dictionary["stores"];
};

export function StoresContactCta({ locale, copy }: StoresContactCtaProps) {
  return (
    <div className="mt-12 text-center">
      <h2 className="mb-4 text-2xl font-bold text-marco-slate">{copy.ctaTitle}</h2>
      <p className="mb-6 text-gray-600">{copy.ctaBody}</p>
      <AppLink
        href={`/${locale}/contact`}
        prefetchPolicy="intent"
        className={STORES_CONTACT_CTA_CLASS}
      >
        {copy.ctaButton}
      </AppLink>
    </div>
  );
}
