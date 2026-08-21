import Image from "next/image";

import { AppLink } from "@/components/ui/AppLink";
import { pickHeroLayout } from "@/features/hero/domain/hero-layout";
import type { StorefrontHeroSlide } from "@/features/hero/application/queries";
import { HomeHeroMobileCarousel } from "@/features/home/ui/HomeHeroMobileCarousel";

const HERO_DESKTOP_IMAGE_SIZES =
  "(max-width: 1024px) 50vw, (max-width: 1280px) 38vw, min(40vw, 520px)";

type HomeHeroProps = {
  slides: StorefrontHeroSlide[];
};

type HeroTileProps = {
  src: string | null;
  href: string | null;
  sizes: string;
  objectPosition: string;
  priority?: boolean;
};

function collectMobileHeroImages(slides: StorefrontHeroSlide[]): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const slide of slides) {
    const url = slide.mobileImageUrl ?? slide.desktopImageUrl;
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }
  return urls;
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

function HeroTile({
  src,
  href,
  sizes,
  objectPosition,
  priority = false,
}: HeroTileProps) {
  const image = src ? (
    <Image
      src={src}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${objectPosition}`}
    />
  ) : (
    <div className="absolute inset-0 bg-neutral-200" />
  );

  const frame = (
    <div className="relative h-full min-w-0 overflow-hidden rounded-[30px]">
      {image}
    </div>
  );

  if (!href) return frame;
  if (isInternalHref(href)) {
    return (
      <AppLink href={href} prefetchPolicy="intent" className="block h-full min-w-0">
        {frame}
      </AppLink>
    );
  }

  return (
    <a href={href} className="block h-full min-w-0">
      {frame}
    </a>
  );
}

export function HomeHero({ slides }: HomeHeroProps) {
  const layout = pickHeroLayout(slides);
  const leftTop = layout.leftTop?.desktopImageUrl ?? null;
  const leftBottom = layout.leftBottom?.desktopImageUrl ?? null;
  const right = layout.right?.desktopImageUrl ?? null;
  const mobileImages = collectMobileHeroImages(slides);

  return (
    <section
      id="hero"
      className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-11 lg:px-8 lg:pt-10"
    >
      <div className="relative aspect-[399/288] w-full min-w-0 overflow-hidden rounded-[24px] bg-neutral-950 md:aspect-[141/68] md:rounded-[32px] md:bg-transparent">
        <HomeHeroMobileCarousel images={mobileImages} />

        <div className="hidden h-full w-full grid-cols-[minmax(0,1.24fr)_minmax(0,0.96fr)] gap-3 md:grid lg:gap-4">
          <div className="grid h-full min-w-0 grid-rows-2 gap-3 lg:gap-4">
            <HeroTile
              src={leftTop}
              href={layout.leftTop?.copy.buttonUrl ?? null}
              sizes={HERO_DESKTOP_IMAGE_SIZES}
              objectPosition="object-[center_16%]"
              priority
            />
            <HeroTile
              src={leftBottom}
              href={layout.leftBottom?.copy.buttonUrl ?? null}
              sizes={HERO_DESKTOP_IMAGE_SIZES}
              objectPosition="object-[center_58%]"
            />
          </div>
          <HeroTile
            src={right}
            href={layout.right?.copy.buttonUrl ?? null}
            sizes="(max-width: 1280px) 42vw, min(45vw, 560px)"
            objectPosition="object-[center_58%]"
          />
        </div>
      </div>
    </section>
  );
}
