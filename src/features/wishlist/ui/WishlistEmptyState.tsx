import { Heart } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import type { WishlistEmptyStateCopy } from "@/features/wishlist/ui/get-wishlist-empty-state";
import {
  WISHLIST_EMPTY_ACTION_CLASS,
  WISHLIST_EMPTY_BODY_CLASS,
  WISHLIST_EMPTY_CLASS,
  WISHLIST_EMPTY_HEADING_CLASS,
  WISHLIST_EMPTY_ICON_CLASS,
  WISHLIST_EMPTY_INNER_CLASS,
} from "@/features/wishlist/ui/wishlist-section-classes";

type WishlistEmptyStateProps = {
  copy: WishlistEmptyStateCopy;
};

export function WishlistEmptyState({ copy }: WishlistEmptyStateProps) {
  return (
    <div className={WISHLIST_EMPTY_CLASS}>
      <div className={WISHLIST_EMPTY_INNER_CLASS}>
        <Heart
          className={WISHLIST_EMPTY_ICON_CLASS}
          strokeWidth={1.5}
          aria-hidden
        />
        <h2 className={WISHLIST_EMPTY_HEADING_CLASS}>{copy.heading}</h2>
        <p className={WISHLIST_EMPTY_BODY_CLASS}>{copy.description}</p>
        <AppLink
          href={copy.actionHref}
          prefetchPolicy="intent"
          className={WISHLIST_EMPTY_ACTION_CLASS}
        >
          {copy.actionLabel}
        </AppLink>
      </div>
    </div>
  );
}
