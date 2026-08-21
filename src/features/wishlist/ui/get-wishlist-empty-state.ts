import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

export type WishlistEmptyStateCopy = {
  heading: string;
  description: string;
  actionHref: string;
  actionLabel: string;
};

type GetWishlistEmptyStateInput = {
  isSignedIn: boolean;
  locale: Locale;
  copy: Dictionary["wishlist"];
  loginLabel: string;
};

function wishlistLoginHref(locale: Locale): string {
  const next = encodeURIComponent(`/${locale}/wishlist`);
  return `/${locale}/login?next=${next}`;
}

/** Resolves empty-wishlist copy and CTA for guest vs signed-in viewers. */
export function getWishlistEmptyState({
  isSignedIn,
  locale,
  copy,
  loginLabel,
}: GetWishlistEmptyStateInput): WishlistEmptyStateCopy {
  if (!isSignedIn) {
    return {
      heading: copy.empty,
      description: copy.signInPrompt,
      actionHref: wishlistLoginHref(locale),
      actionLabel: loginLabel,
    };
  }

  return {
    heading: copy.empty,
    description: copy.emptyDescription,
    actionHref: `/${locale}/products`,
    actionLabel: copy.browseProducts,
  };
}
