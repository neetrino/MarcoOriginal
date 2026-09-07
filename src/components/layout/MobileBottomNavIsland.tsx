import { Suspense } from "react";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getCartItemCount } from "@/features/cart/cart";
import { getHeaderCategoryMenu } from "@/features/categories/application/load-header-category-menu";
import { getCurrentUser } from "@/lib/auth/session";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { Currency } from "@/lib/money/currency";

type MobileBottomNavIslandProps = {
  locale: Locale;
  currency: Currency;
  dictionary: Dictionary;
};

function MobileBottomNavFallback() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 h-[calc(4rem+env(safe-area-inset-bottom))] bg-transparent md:hidden"
      aria-hidden="true"
    />
  );
}

async function MobileBottomNavAsync({
  locale,
  currency,
  dictionary,
}: MobileBottomNavIslandProps) {
  const [user, cartItemCount, categories] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
    getHeaderCategoryMenu(locale),
  ]);

  return (
    <MobileBottomNav
      locale={locale}
      currency={currency}
      dictionary={dictionary}
      cartItemCount={cartItemCount}
      isSignedIn={Boolean(user)}
      categories={categories}
    />
  );
}

/**
 * Mobile-only tab bar; counts stream in via Suspense so layout chrome is not blocked.
 */
export function MobileBottomNavIsland({
  locale,
  currency,
  dictionary,
}: MobileBottomNavIslandProps) {
  return (
    <Suspense fallback={<MobileBottomNavFallback />}>
      <MobileBottomNavAsync
        locale={locale}
        currency={currency}
        dictionary={dictionary}
      />
    </Suspense>
  );
}
