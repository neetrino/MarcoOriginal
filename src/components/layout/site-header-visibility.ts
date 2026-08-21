import { isLocale } from "@/lib/i18n/config";

const SITE_HEADER_HIDDEN_SECTIONS = new Set(["profile", "admin"]);

function getRouteSection(pathname: string): string | undefined {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first)) {
    return segments[1];
  }
  return first;
}

/**
 * Profile and admin use their own chrome (sidebar / app shell).
 * The storefront header must not render on those routes.
 */
export function shouldHideSiteHeader(pathname: string): boolean {
  const section = getRouteSection(pathname);
  return section !== undefined && SITE_HEADER_HIDDEN_SECTIONS.has(section);
}
