import { Suspense } from "react";

import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { getCartItemCount } from "@/features/cart/cart";
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
  const [user, cartItemCount] = await Promise.all([
    getCurrentUser(),
    getCartItemCount(),
  ]);

  return (
    <MobileBottomNav
      locale={locale}
      currency={currency}
      dictionary={dictionary}
      cartItemCount={cartItemCount}
      isSignedIn={Boolean(user)}
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
