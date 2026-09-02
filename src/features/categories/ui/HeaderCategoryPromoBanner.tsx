import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { AppLink } from "@/components/ui/AppLink";
import {
  headerCategoryPromoImageUrl,
  headerCategoryPromoText,
  type HeaderCategoryPromoCopy,
  type HeaderCategoryPromoKey,
} from "@/features/categories/domain/header-category-promo";
import {
  HEADER_CATEGORY_PROMO_BADGE_CLASS,
  HEADER_CATEGORY_PROMO_CARD_CLASS,
  HEADER_CATEGORY_PROMO_CONTENT_CLASS,
  HEADER_CATEGORY_PROMO_CTA_CLASS,
  HEADER_CATEGORY_PROMO_CTA_ICON_CLASS,
  HEADER_CATEGORY_PROMO_HEADLINE_CLASS,
  HEADER_CATEGORY_PROMO_IMAGE_WRAP_CLASS,
  HEADER_CATEGORY_PROMO_SUBLINE_CLASS,
} from "@/features/categories/ui/header-category-menu.classes";

type HeaderCategoryPromoBannerProps = {
  promoKey: HeaderCategoryPromoKey;
  href: string;
  copy: HeaderCategoryPromoCopy;
  bannerImageUrl?: string | null;
  drawerTitle?: string | null;
  onNavigate: () => void;
};

/** Category-specific promo card shown above the mega-menu subcategory grid. */
export function HeaderCategoryPromoBanner({
  promoKey,
  href,
  copy,
  bannerImageUrl = null,
  drawerTitle = null,
  onNavigate,
}: HeaderCategoryPromoBannerProps) {
  const text = headerCategoryPromoText(promoKey, copy, drawerTitle);
  const imageUrl = headerCategoryPromoImageUrl(promoKey, bannerImageUrl);

  return (
    <div className={HEADER_CATEGORY_PROMO_CARD_CLASS}>
      {imageUrl ? (
        <div className={HEADER_CATEGORY_PROMO_IMAGE_WRAP_CLASS} aria-hidden>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="280px"
            className="object-contain object-right-bottom opacity-90"
          />
        </div>
      ) : null}
      <div className={HEADER_CATEGORY_PROMO_CONTENT_CLASS}>
        <p className={HEADER_CATEGORY_PROMO_BADGE_CLASS}>{text.badge}</p>
        <h2 className={HEADER_CATEGORY_PROMO_HEADLINE_CLASS}>{text.headline}</h2>
        <p className={HEADER_CATEGORY_PROMO_SUBLINE_CLASS}>{text.subline}</p>
        <AppLink
          href={href}
          prefetchPolicy="none"
          onClick={onNavigate}
          className={HEADER_CATEGORY_PROMO_CTA_CLASS}
        >
          <span className="min-w-0 whitespace-nowrap">{text.cta}</span>
          <span className={HEADER_CATEGORY_PROMO_CTA_ICON_CLASS} aria-hidden>
            <ArrowUpRight
              className="size-3.5 shrink-0 sm:size-4"
              strokeWidth={2.5}
            />
          </span>
        </AppLink>
      </div>
    </div>
  );
}
