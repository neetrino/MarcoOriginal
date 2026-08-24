import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { HomeBannerCta } from "@/features/home/ui/HomeBannerCta";
import {
  HOME_PROMO_GRID_CLASS,
  HOME_PROMO_LEFT_ASPECT,
  HOME_PROMO_LEFT_CTA_OFFSET_X_PX,
  HOME_PROMO_LEFT_CTA_OFFSET_Y_PX,
  HOME_PROMO_LEFT_FALLBACK_HEX,
  HOME_PROMO_LEFT_MAX_WIDTH_CLASS,
  HOME_PROMO_RADIUS_PX,
  HOME_PROMO_RIGHT_CTA_OFFSET_X_PX,
  HOME_PROMO_RIGHT_CTA_OFFSET_Y_PX,
  HOME_PROMO_RIGHT_FALLBACK_HEX,
  HOME_PROMO_RIGHT_STACK_ASPECT_CLASS,
  HOME_PROMO_ROW_GAP_PX,
  HOME_PROMO_SECTION_MARGIN_TOP_PX,
} from "@/features/home/ui/home-floor-banners.constants";
import { HOME_PAGE_SHELL_CLASS } from "@/features/home/ui/home-section-classes";

type PromoTile = {
  imageUrl: string | null;
  href: string;
  ariaLabel: string;
  ctaLabel: string;
};

type HomePromoBannersProps = {
  left: PromoTile;
  right: PromoTile;
};

export function HomePromoBanners({ left, right }: HomePromoBannersProps) {
  if (!left.imageUrl && !right.imageUrl) {
    return null;
  }

  return (
    <div
      className="hidden w-full bg-white pb-10 pt-6 md:block"
      style={{ marginTop: HOME_PROMO_SECTION_MARGIN_TOP_PX }}
    >
      <div
        className={`${HOME_PAGE_SHELL_CLASS} ${HOME_PROMO_GRID_CLASS}`}
        style={{ gap: HOME_PROMO_ROW_GAP_PX }}
      >
        {left.imageUrl ? (
          <PromoLeftCard tile={left} />
        ) : (
          <div className="min-w-0" />
        )}
        {right.imageUrl ? <PromoRightCard tile={right} /> : null}
      </div>
    </div>
  );
}

function PromoLeftCard({ tile }: { tile: PromoTile }) {
  return (
    <div className="min-w-0">
      <AppLink
        href={tile.href}
        prefetchPolicy="intent"
        aria-label={tile.ariaLabel}
        className={`group/banner relative block w-full overflow-hidden transition hover:-translate-y-0.5 active:translate-y-px ${HOME_PROMO_LEFT_MAX_WIDTH_CLASS}`}
        style={{
          aspectRatio: HOME_PROMO_LEFT_ASPECT,
          borderRadius: HOME_PROMO_RADIUS_PX,
          backgroundColor: HOME_PROMO_LEFT_FALLBACK_HEX,
        }}
      >
        <Image
          src={tile.imageUrl ?? ""}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 460px"
          className="object-cover"
        />
        <div className="absolute inset-0 z-[1] flex flex-col pb-5 pt-4">
          <div className="min-h-0 flex-1" />
          <div
            className="pointer-events-none flex shrink-0 justify-start"
            style={{
              transform: `translate(${HOME_PROMO_LEFT_CTA_OFFSET_X_PX}px, ${HOME_PROMO_LEFT_CTA_OFFSET_Y_PX}px)`,
            }}
          >
            <HomeBannerCta label={tile.ctaLabel} variant="yellow" decorative />
          </div>
        </div>
      </AppLink>
    </div>
  );
}

function PromoRightCard({ tile }: { tile: PromoTile }) {
  return (
    <div
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden md:aspect-auto ${HOME_PROMO_RIGHT_STACK_ASPECT_CLASS}`}
      style={{
        borderRadius: HOME_PROMO_RADIUS_PX,
        backgroundColor: HOME_PROMO_RIGHT_FALLBACK_HEX,
      }}
      role="region"
      aria-label={tile.ariaLabel}
    >
      {tile.imageUrl ? (
        <Image
          src={tile.imageUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 760px"
          className="object-cover"
        />
      ) : null}
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1" />
        <div
          className="flex shrink-0 justify-start px-2 pb-3"
          style={{
            transform: `translate(${HOME_PROMO_RIGHT_CTA_OFFSET_X_PX}px, ${HOME_PROMO_RIGHT_CTA_OFFSET_Y_PX}px)`,
          }}
        >
          <HomeBannerCta
            label={tile.ctaLabel}
            variant="slate"
            href={tile.href}
            ariaLabel={tile.ariaLabel}
          />
        </div>
      </div>
    </div>
  );
}
