"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { ProductDrawerSegmentedControl } from "@/features/products/ui/ProductDrawerSegmentedControl";
import { locales, type Locale } from "@/lib/i18n/config";

const localeSegmentLabels: Record<Locale, string> = {
  hy: "ՀԱՅ",
  en: "ENG",
  ru: "РУС",
};

type MobileNavDrawerLocaleSwitchProps = {
  locale: Locale;
  languageLabel: string;
  onNavigate?: () => void;
};

function replaceLocaleInPath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/");
  if (segments.length > 1) {
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }
  return `/${nextLocale}`;
}

/**
 * Segmented locale picker for the mobile menu popup footer.
 */
export function MobileNavDrawerLocaleSwitch({
  locale,
  languageLabel,
  onNavigate,
}: MobileNavDrawerLocaleSwitchProps) {
  const router = useRouter();
  const pathname = usePathname() ?? `/${locale}`;
  const [pending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale): void {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.push(replaceLocaleInPath(pathname, nextLocale));
      onNavigate?.();
    });
  }

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-xs font-semibold text-marco-black/70">
        {languageLabel}
      </p>
      <ProductDrawerSegmentedControl
        ariaLabel={languageLabel}
        disabled={pending}
        value={locale}
        options={locales.map((value) => ({
          value,
          label: localeSegmentLabels[value],
        }))}
        onChange={handleChange}
      />
    </div>
  );
}
