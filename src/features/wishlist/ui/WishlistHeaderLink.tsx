import { Heart } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { Locale } from "@/lib/i18n/config";

type WishlistHeaderLinkProps = {
  locale: Locale;
  label: string;
  count: number;
};

export function WishlistHeaderLink({
  locale,
  label,
  count,
}: WishlistHeaderLinkProps) {
  return (
    <AppLink
      href={`/${locale}/wishlist`}
      prefetchPolicy="intent"
      aria-label={label}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-marco-gray text-marco-slate transition-colors duration-200 hover:bg-marco-yellow"
    >
      <Heart className="h-5 w-5" aria-hidden="true" />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-marco-slate px-1 text-[10px] font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </AppLink>
  );
}
