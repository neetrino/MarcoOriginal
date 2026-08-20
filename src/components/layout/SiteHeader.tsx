import { Suspense } from "react";

import { LocaleCurrencySwitcher } from "@/components/layout/LocaleCurrencySwitcher";
import { MarcoLogo } from "@/components/layout/MarcoLogo";
import { MobileNavDrawer } from "@/components/layout/MobileNavDrawer";
import { SiteHeaderMainNav } from "@/components/layout/SiteHeaderMainNav";
import { SiteHeaderTopBar } from "@/components/layout/SiteHeaderTopBar";
import {
  HEADER_MOBILE_ROUND_CONTROL_CLASS,
  SITE_HEADER_INNER,
} from "@/components/layout/site-header-classes";
import { getCartItemCount } from "@/features/cart/cart";
import { getCompareCount } from "@/features/compare/queries";
import { getWishlistCount } from "@/features/wishlist/queries";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

type SiteHeaderProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
};

function HeaderControlsFallback() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className={`${SITE_HEADER_INNER} py-2`}>
        <div
          className="h-10 w-full animate-pulse rounded-[89px] bg-marco-gray"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

async function SiteHeaderMainNavAsync({
  locale,
  currency,
  dictionary,
}: SiteHeaderProps) {
  const [user, cartItemCount, wishlistCount, compareCount] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
    getWishlistCount(),
    getCompareCount(),
  ]);

  return (
    <SiteHeaderMainNav
      locale={locale}
      currency={currency}
      dictionary={dictionary}
      user={user}
      cartItemCount={cartItemCount}
      wishlistCount={wishlistCount}
      compareCount={compareCount}
    />
  );
}

function buildNavItems(locale: Locale, dictionary: Dictionary) {
  return [
    { href: `/${locale}`, label: dictionary.nav.home },
    { href: `/${locale}/products`, label: dictionary.nav.shop },
    { href: `/${locale}/brand`, label: dictionary.nav.brand },
    { href: `/${locale}/blog`, label: dictionary.nav.blog },
    { href: `/${locale}/about`, label: dictionary.nav.about },
    { href: `/${locale}/contact`, label: dictionary.nav.contact },
  ] as const;
}

/**
 * Storefront chrome: compact bar + desktop top row stream immediately;
 * search/account/cart load in a Suspense island.
 */
export function SiteHeader({ locale, currency, dictionary }: SiteHeaderProps) {
  const navItems = buildNavItems(locale, dictionary);

  return (
    <div
      className="site-header sticky top-0 z-[80] shrink-0 bg-white"
      data-site-header
    >
      <div className="border-b border-gray-200 min-[1180px]:hidden">
        <div
          className={`${SITE_HEADER_INNER} grid grid-cols-[1fr_auto_1fr] items-center py-2`}
        >
          <div className="justify-self-start">
            <MobileNavDrawer
              locale={locale}
              dictionary={dictionary}
              navItems={navItems}
              triggerClassName={HEADER_MOBILE_ROUND_CONTROL_CLASS}
            />
          </div>
          <MarcoLogo locale={locale} ariaLabel={dictionary.header.logoHome} />
          <div className="justify-self-end">
            <LocaleCurrencySwitcher
              locale={locale}
              currency={currency}
              currencyLabel={dictionary.header.currency}
              languageLabel={dictionary.header.language}
            />
          </div>
        </div>
      </div>

      <SiteHeaderTopBar
        locale={locale}
        dictionary={dictionary}
        navItems={navItems}
      />

      <Suspense fallback={<HeaderControlsFallback />}>
        <SiteHeaderMainNavAsync
          locale={locale}
          currency={currency}
          dictionary={dictionary}
        />
      </Suspense>
    </div>
  );
}
