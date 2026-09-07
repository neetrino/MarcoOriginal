import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { HomeBannerCta } from "@/features/home/ui/HomeBannerCta";
import {
  HOME_NEETRINO_CREDIT_GAP_PX,
  HOME_PROMO_RADIUS_PX,
} from "@/features/home/ui/home-floor-banners.constants";
import { HOME_PAGE_SHELL_CLASS } from "@/features/home/ui/home-section-classes";

const HOME_MOBILE_FLOOR_IMAGE_SIZES =
  "(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), 0px";

const NEETRINO_HREF = "https://www.neetrino.com/";

type HomeMobileFloorBannerProps = {
  imageUrl: string;
  href: string;
  ariaLabel: string;
  ctaLabel: string;
  neetrinoCreditLabel: string;
};

/** Promo floor card below brands on mobile — matches 3001. */
export function HomeMobileFloorBanner({
  imageUrl,
  href,
  ariaLabel,
  ctaLabel,
  neetrinoCreditLabel,
}: HomeMobileFloorBannerProps) {
  return (
    <div className="w-full bg-white px-0 pb-8 md:hidden">
      <div className={HOME_PAGE_SHELL_CLASS}>
        <div
          className="flex justify-center"
          style={{
            paddingTop: HOME_NEETRINO_CREDIT_GAP_PX,
            paddingBottom: HOME_NEETRINO_CREDIT_GAP_PX,
          }}
        >
          <a
            href={NEETRINO_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-neetrino-credit text-sm font-bold tracking-[0.12em] text-marco-yellow no-underline"
          >
            {neetrinoCreditLabel}
          </a>
        </div>
        <AppLink
          href={href}
          prefetchPolicy="intent"
          aria-label={ariaLabel}
          className="relative block aspect-[522/372] w-full overflow-hidden"
          style={{ borderRadius: HOME_PROMO_RADIUS_PX }}
        >
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes={HOME_MOBILE_FLOOR_IMAGE_SIZES}
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-x-4 bottom-4">
            <HomeBannerCta label={ctaLabel} variant="yellow" decorative />
          </div>
        </AppLink>
      </div>
    </div>
  );
}
