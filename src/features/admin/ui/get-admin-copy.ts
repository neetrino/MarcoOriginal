import { defaultLocale, isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/get-dictionary";

export type AdminCopy = Dictionary["admin"];

export function resolveAdminLocale(locale: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

/** Locale catalog for admin chrome and pages. */
export function getAdminCopy(locale: string): AdminCopy {
  return getDictionary(resolveAdminLocale(locale)).admin;
}

/** Replaces `{name}` tokens in admin catalog strings. */
export function formatAdminMessage(
  template: string,
  values: Record<string, string | number>,
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
