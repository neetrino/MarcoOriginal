import type { Dictionary } from "@/lib/i18n/get-dictionary";

import {
  POLICY_BODY_CLASS,
  POLICY_HEADING_CLASS,
  POLICY_LIST_CLASS,
  POLICY_SECTION_CLASS,
  POLICY_TITLE_CLASS,
} from "@/features/legal/ui/policy-page.classes";

type PrivacyCopy = Dictionary["privacy"];

type PrivacyPolicyContentProps = {
  copy: PrivacyCopy;
};

type PrivacySection = PrivacyCopy["sections"][number];

function PrivacySectionBlock({ section }: { section: PrivacySection }) {
  return (
    <section className={POLICY_SECTION_CLASS}>
      <h2 className={POLICY_HEADING_CLASS}>{section.title}</h2>
      {section.intro ? <p className={POLICY_BODY_CLASS}>{section.intro}</p> : null}
      {section.points.length > 0 ? (
        <ul className={POLICY_LIST_CLASS}>
          {section.points.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.closing ? (
        <p className={POLICY_BODY_CLASS}>{section.closing}</p>
      ) : null}
    </section>
  );
}

export function PrivacyPolicyContent({ copy }: PrivacyPolicyContentProps) {
  return (
    <>
      <h1 className={POLICY_TITLE_CLASS}>{copy.title}</h1>
      <div className={POLICY_SECTION_CLASS}>
        {copy.intro.map((paragraph) => (
          <p key={paragraph} className={POLICY_BODY_CLASS}>
            {paragraph}
          </p>
        ))}
      </div>
      {copy.sections.map((section) => (
        <PrivacySectionBlock key={section.title} section={section} />
      ))}
    </>
  );
}
