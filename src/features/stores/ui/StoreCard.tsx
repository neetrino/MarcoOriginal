import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import {
  CONTACT_EMAILS,
  mapsDirectionsUrlForLocation,
  phoneToTelHref,
  type ContactLocation,
} from "@/features/contact/content/contact-locations";
import { STORE_IMAGE_SRC } from "@/features/stores/content/store-directory";
import {
  STORES_CARD_CLASS,
  STORES_DETAIL_LINK_CLASS,
  STORES_DETAIL_TEXT_CLASS,
  STORES_DIRECTIONS_CLASS,
  STORES_ICON_CLASS,
} from "@/features/stores/ui/stores-section-classes";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type StoreCardProps = {
  location: ContactLocation;
  copy: Dictionary["stores"];
};

function StoreDetailRow({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      {children}
    </div>
  );
}

function StoreCardContacts({ location }: { location: ContactLocation }) {
  return (
    <>
      <StoreDetailRow
        icon={<Phone className={STORES_ICON_CLASS} aria-hidden strokeWidth={2} />}
      >
        <div className="flex flex-col gap-1">
          {location.phones.map((phone) => (
            <a key={phone} href={phoneToTelHref(phone)} className={STORES_DETAIL_LINK_CLASS}>
              {phone}
            </a>
          ))}
        </div>
      </StoreDetailRow>
      <div className="space-y-1">
        {CONTACT_EMAILS.map((email) => (
          <StoreDetailRow
            key={email}
            icon={<Mail className={STORES_ICON_CLASS} aria-hidden strokeWidth={2} />}
          >
            <a href={`mailto:${email}`} className={STORES_DETAIL_LINK_CLASS}>
              {email}
            </a>
          </StoreDetailRow>
        ))}
      </div>
    </>
  );
}

export function StoreCard({ location, copy }: StoreCardProps) {
  const name = copy.names[location.id];
  const hours = copy.hours[location.id];
  const imageSrc = STORE_IMAGE_SRC[location.id];
  const directionsHref = mapsDirectionsUrlForLocation(location);
  const directionsLabel = copy.directionsAria.replace("{name}", name);

  return (
    <article className={STORES_CARD_CLASS}>
      <div className="relative aspect-square bg-gray-200">
        <Image
          src={imageSrc}
          alt={`${name} — ${location.address}`}
          fill
          className="object-contain"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="p-6">
        <h2 className="mb-4 text-2xl font-bold text-marco-slate">{name}</h2>
        <div className="mb-6 space-y-3">
          <StoreDetailRow
            icon={<MapPin className={STORES_ICON_CLASS} aria-hidden strokeWidth={2} />}
          >
            <p className={STORES_DETAIL_TEXT_CLASS}>{location.address}</p>
          </StoreDetailRow>
          <StoreCardContacts location={location} />
          <StoreDetailRow
            icon={<Clock className={STORES_ICON_CLASS} aria-hidden strokeWidth={2} />}
          >
            <p className={`whitespace-pre-line ${STORES_DETAIL_TEXT_CLASS}`}>{hours}</p>
          </StoreDetailRow>
        </div>
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={directionsLabel}
          className={STORES_DIRECTIONS_CLASS}
        >
          {copy.directions}
        </a>
      </div>
    </article>
  );
}
