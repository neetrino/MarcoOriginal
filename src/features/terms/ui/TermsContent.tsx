import type { Dictionary } from "@/lib/i18n/get-dictionary";

import {
  POLICY_BODY_CLASS,
  POLICY_CLAUSE_LABEL_CLASS,
  POLICY_HEADING_CLASS,
  POLICY_LIST_CLASS,
  POLICY_SECTION_CLASS,
  POLICY_TITLE_CLASS,
} from "@/features/legal/ui/policy-page.classes";

type TermsCopy = Dictionary["terms"];
type TermsSection = TermsCopy["sections"][number];
type TermsItem = TermsSection["items"][number];

type TermsContentProps = {
  copy: TermsCopy;
};

function TermsPoints({ points }: { points: readonly string[] }) {
  if (points.length === 0) {
    return null;
  }

  return (
    <ul className={POLICY_LIST_CLASS}>
      {points.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function TermsClause({ item }: { item: TermsItem }) {
  return (
    <div className="space-y-3">
      <p className={POLICY_BODY_CLASS}>
        <span className={POLICY_CLAUSE_LABEL_CLASS}>{item.label}. </span>
        {item.text}
      </p>
      <TermsPoints points={item.points} />
    </div>
  );
}

function TermsSectionBlock({ section }: { section: TermsSection }) {
  return (
    <section className={POLICY_SECTION_CLASS}>
      <h2 className={POLICY_HEADING_CLASS}>{section.title}</h2>
      {section.intro ? <p className={POLICY_BODY_CLASS}>{section.intro}</p> : null}
      <TermsPoints points={section.points} />
      {section.items.map((item) => (
        <TermsClause key={item.label} item={item} />
      ))}
    </section>
  );
}

export function TermsContent({ copy }: TermsContentProps) {
  return (
    <>
      <h1 className={POLICY_TITLE_CLASS}>{copy.title}</h1>
      {copy.sections.map((section) => (
        <TermsSectionBlock key={section.title} section={section} />
      ))}
    </>
  );
}
