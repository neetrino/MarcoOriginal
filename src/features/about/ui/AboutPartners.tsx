import {
  ABOUT_ACCENT_BAR_CLASS,
  ABOUT_EYEBROW_CLASS,
  ABOUT_SECTION_INNER_CLASS,
} from "@/features/about/ui/about-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type AboutPartnersProps = {
  copy: Dictionary["about"];
};

export function AboutPartners({ copy }: AboutPartnersProps) {
  return (
    <section className="border-t border-border/70 bg-marco-gray/40 py-16 md:py-24">
      <div className={ABOUT_SECTION_INNER_CLASS}>
        <div className="mx-auto max-w-4xl text-center">
          <div className={`mx-auto mb-5 ${ABOUT_ACCENT_BAR_CLASS}`} />

          <p className={`mb-4 ${ABOUT_EYEBROW_CLASS}`}>{copy.partnersEyebrow}</p>

          <h2 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
            {copy.partnersTitle}
          </h2>

          <div className="space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
            {copy.partnersParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
