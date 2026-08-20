import { MapPin } from "lucide-react";

import {
  CONTACT_EMAILS,
  phoneToTelHref,
  type ContactLocation,
} from "@/features/contact/content/contact-locations";
import {
  ContactMailIcon,
  ContactPhoneIcon,
} from "@/features/contact/ui/ContactBrandIcons";
import { CONTACT_DIVIDER_CLASS } from "@/features/contact/ui/contact-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type ContactInfoProps = {
  copy: Dictionary["contact"];
  locations: readonly ContactLocation[];
};

function ContactLocationBlock({
  location,
  isLast,
}: {
  location: ContactLocation;
  isLast: boolean;
}) {
  return (
    <div
      id={`contact-loc-${location.id}`}
      className={`space-y-2 rounded-xl border border-transparent px-3 py-2 ${
        isLast ? "pb-0" : "pb-4"
      }`}
    >
      <div className="flex items-start gap-2">
        <MapPin
          className="mt-0.5 h-[18px] w-[18px] shrink-0 translate-y-[2px] text-marco-yellow"
          strokeWidth={2}
          aria-hidden
        />
        <p className="text-sm leading-snug font-medium text-foreground sm:text-base">
          {location.address}
        </p>
      </div>
      <div className="flex items-start gap-2">
        <ContactPhoneIcon className="mt-0.5 h-[13px] w-auto shrink-0 translate-y-[4px] text-marco-yellow" />
        <div className="flex flex-col gap-px">
          {location.phones.map((phone) => (
            <a
              key={phone}
              href={phoneToTelHref(phone)}
              className="text-sm leading-snug font-semibold text-foreground transition-colors hover:text-marco-yellow sm:text-base"
            >
              {phone}
            </a>
          ))}
        </div>
      </div>
      {isLast ? null : <div className={CONTACT_DIVIDER_CLASS} aria-hidden />}
    </div>
  );
}

export function ContactInfo({ copy, locations }: ContactInfoProps) {
  return (
    <div className="flex w-full flex-col md:max-w-lg">
      <p className="mb-2 text-[11px] font-bold tracking-[0.08em] text-muted uppercase">
        {copy.writeToUsTitle}
      </p>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {copy.title}
      </h1>
      <div className="w-full max-w-md">
        {locations.map((location, index) => (
          <ContactLocationBlock
            key={location.id}
            location={location}
            isLast={index === locations.length - 1}
          />
        ))}
        <div className={`${CONTACT_DIVIDER_CLASS} mt-2`} aria-hidden />
        <div className="space-y-2.5 pt-6">
          {CONTACT_EMAILS.map((email) => (
            <div key={email} className="flex items-start gap-2">
              <ContactMailIcon className="mt-0.5 h-[12px] w-auto shrink-0 translate-y-[3px] text-marco-yellow" />
              <a
                href={`mailto:${email}`}
                className="text-xs leading-snug font-semibold break-all text-foreground transition-colors hover:text-marco-yellow sm:text-sm"
              >
                {email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
