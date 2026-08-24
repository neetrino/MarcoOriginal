import Image from "next/image";

import { HOME_PAGE_SHELL_CLASS } from "@/features/home/ui/home-section-classes";
import {
  HOME_APP_BANNER_IMAGE_HEIGHT,
  HOME_APP_BANNER_IMAGE_WIDTH,
} from "@/features/home/ui/home-floor-banners.constants";

type HomeAppBannerProps = {
  imageUrl: string;
  sectionLabel: string;
  imageAlt: string;
};

/** Full-width app download banner below brands on desktop. */
export function HomeAppBanner({
  imageUrl,
  sectionLabel,
  imageAlt,
}: HomeAppBannerProps) {
  return (
    <div
      role="region"
      className="hidden w-full overflow-hidden bg-white md:block"
      aria-label={sectionLabel}
    >
      <div className={HOME_PAGE_SHELL_CLASS}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={HOME_APP_BANNER_IMAGE_WIDTH}
          height={HOME_APP_BANNER_IMAGE_HEIGHT}
          className="h-auto w-full max-w-full object-cover object-center"
          sizes="(max-width: 1280px) 100vw, 1216px"
        />
      </div>
    </div>
  );
}
