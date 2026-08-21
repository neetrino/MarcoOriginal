import { ABOUT_HERO_YOUTUBE_VIDEO_ID } from "@/features/about/content/about-hero-video";
import { AboutHeroVideo } from "@/features/about/ui/AboutHeroVideo";
import {
  ABOUT_ACCENT_BAR_CLASS,
  ABOUT_EYEBROW_CLASS,
  ABOUT_SECTION_INNER_CLASS,
} from "@/features/about/ui/about-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutHeroProps = {
  copy: Dictionary["about"];
};

export function AboutHero({ copy }: AboutHeroProps) {
  const playLabel = copy.playVideoAria.replace("{title}", copy.title);

  return (
    <section className="bg-white py-8 md:py-24">
      <div className={ABOUT_SECTION_INNER_CLASS}>
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <AboutHeroVideo
            videoId={ABOUT_HERO_YOUTUBE_VIDEO_ID}
            title={copy.title}
            playLabel={playLabel}
          />

          <div className="space-y-6 lg:py-4">
            <div className={ABOUT_ACCENT_BAR_CLASS} />

            <p className={ABOUT_EYEBROW_CLASS}>{copy.eyebrow}</p>

            <h1 className="text-3xl leading-tight font-bold text-marco-slate md:text-5xl lg:text-6xl">
              {copy.title}
            </h1>

            <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
              {copy.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
