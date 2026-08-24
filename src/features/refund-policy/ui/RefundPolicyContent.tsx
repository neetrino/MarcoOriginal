import type { Dictionary } from "@/lib/i18n/get-dictionary";

import {
  POLICY_BODY_CLASS,
  POLICY_CONTACT_LINK_CLASS,
  POLICY_HEADING_CLASS,
  POLICY_LIST_CLASS,
  POLICY_META_CLASS,
  POLICY_ORDERED_LIST_CLASS,
  POLICY_SECTION_CLASS,
  POLICY_TITLE_CLASS,
} from "@/features/legal/ui/policy-page.classes";

type RefundCopy = Dictionary["refundPolicy"];

type RefundPolicyContentProps = {
  copy: RefundCopy;
};

type PolicyListSectionProps = {
  title: string;
  intro?: string;
  items: readonly string[];
  ordered?: boolean;
};

function PolicyListSection({
  title,
  intro,
  items,
  ordered = false,
}: PolicyListSectionProps) {
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered ? POLICY_ORDERED_LIST_CLASS : POLICY_LIST_CLASS;

  return (
    <section className={POLICY_SECTION_CLASS}>
      <h2 className={POLICY_HEADING_CLASS}>{title}</h2>
      {intro ? <p className={POLICY_BODY_CLASS}>{intro}</p> : null}
      <ListTag className={listClass}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
}

export function RefundPolicyContent({ copy }: RefundPolicyContentProps) {
  return (
    <>
      <header className="space-y-2">
        <h1 className={POLICY_TITLE_CLASS}>{copy.title}</h1>
        <p className={POLICY_META_CLASS}>
          {copy.lastUpdatedLabel}: {copy.lastUpdated}
        </p>
      </header>
      <section className={POLICY_SECTION_CLASS}>
        <h2 className={POLICY_HEADING_CLASS}>{copy.overview.title}</h2>
        <p className={POLICY_BODY_CLASS}>{copy.overview.intro}</p>
      </section>
      <PolicyListSection
        title={copy.eligibility.title}
        intro={copy.eligibility.intro}
        items={copy.eligibility.points}
      />
      <PolicyListSection
        title={copy.howToReturn.title}
        items={copy.howToReturn.steps}
        ordered
      />
      <PolicyListSection title={copy.method.title} items={copy.method.points} />
      <PolicyListSection
        title={copy.nonRefundable.title}
        items={copy.nonRefundable.points}
      />
      <section className={POLICY_SECTION_CLASS}>
        <h2 className={POLICY_HEADING_CLASS}>{copy.contact.title}</h2>
        <p className={POLICY_BODY_CLASS}>
          {copy.contact.intro}{" "}
          <a
            href={`mailto:${copy.contact.email}`}
            className={POLICY_CONTACT_LINK_CLASS}
          >
            {copy.contact.email}
          </a>
        </p>
      </section>
    </>
  );
}
