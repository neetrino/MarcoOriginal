import { Heart } from "lucide-react";

import {
  WISHLIST_COUNT_ICON_CLASS,
  WISHLIST_COUNT_ROW_CLASS,
  WISHLIST_COUNT_TEXT_CLASS,
  WISHLIST_COUNT_VALUE_CLASS,
} from "@/features/wishlist/ui/wishlist-section-classes";

type WishlistCountBarProps = {
  label: string;
  count: number;
};

export function WishlistCountBar({ label, count }: WishlistCountBarProps) {
  return (
    <div className={WISHLIST_COUNT_ROW_CLASS}>
      <Heart className={WISHLIST_COUNT_ICON_CLASS} strokeWidth={2} aria-hidden />
      <p className={WISHLIST_COUNT_TEXT_CLASS}>
        {label}: <span className={WISHLIST_COUNT_VALUE_CLASS}>{count}</span>
      </p>
    </div>
  );
}
