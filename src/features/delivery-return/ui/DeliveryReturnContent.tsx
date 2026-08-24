import type { Dictionary } from "@/lib/i18n/get-dictionary";

import {
  POLICY_BODY_CLASS,
  POLICY_CONTACT_LINK_CLASS,
  POLICY_DELIVERY_CARD_BODY_CLASS,
  POLICY_HEADING_CLASS,
  POLICY_LIST_CLASS,
  POLICY_ORDERED_LIST_CLASS,
} from "@/features/legal/ui/policy-page.classes";

type DeliveryReturnCopy = Dictionary["deliveryReturn"];

type DeliveryReturnContentProps = {
  copy: DeliveryReturnCopy;
};

type PolicySectionProps = {
  title: string;
  intro?: string;
  items: readonly string[];
  ordered?: boolean;
};

function PolicySection({
  title,
  intro,
  items,
  ordered = false,
}: PolicySectionProps) {
  const ListTag = ordered ? "ol" : "ul";
  const listClass = ordered ? POLICY_ORDERED_LIST_CLASS : POLICY_LIST_CLASS;

  return (
    <>
      <h2 className={POLICY_HEADING_CLASS}>{title}</h2>
      {intro ? <p className={POLICY_BODY_CLASS}>{intro}</p> : null}
      <ListTag className={listClass}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </>
  );
}

function DeliveryReturnContact({
  copy,
}: {
  copy: DeliveryReturnCopy["contact"];
}) {
  const phoneHref = `tel:${copy.phone.replaceAll(" ", "")}`;

  return (
    <>
      <p className={POLICY_BODY_CLASS}>{copy.intro}</p>
      <p className={POLICY_BODY_CLASS}>
        {copy.emailLabel}:{" "}
        <a href={`mailto:${copy.email}`} className={POLICY_CONTACT_LINK_CLASS}>
          {copy.email}
        </a>
      </p>
      <p className={POLICY_BODY_CLASS}>
        {copy.phoneLabel}:{" "}
        <a href={phoneHref} className={POLICY_CONTACT_LINK_CLASS}>
          {copy.phone}
        </a>
      </p>
      <p className={POLICY_BODY_CLASS}>
        {copy.hoursLabel}: {copy.hoursWeekdays}
      </p>
      <p className={POLICY_BODY_CLASS}>{copy.hoursSunday}</p>
    </>
  );
}

export function DeliveryReturnContent({ copy }: DeliveryReturnContentProps) {
  return (
    <div className={POLICY_DELIVERY_CARD_BODY_CLASS}>
      <PolicySection
        title={copy.delivery.title}
        intro={copy.delivery.intro}
        items={copy.delivery.points}
      />
      <PolicySection
        title={copy.returnPolicy.title}
        intro={copy.returnPolicy.intro}
        items={copy.returnPolicy.points}
      />
      <PolicySection
        title={copy.howToReturn.title}
        items={copy.howToReturn.steps}
        ordered
      />
      <PolicySection title={copy.refund.title} items={copy.refund.points} />
      <PolicySection
        title={copy.nonRefundable.title}
        items={copy.nonRefundable.points}
      />
      <DeliveryReturnContact copy={copy.contact} />
    </div>
  );
}
