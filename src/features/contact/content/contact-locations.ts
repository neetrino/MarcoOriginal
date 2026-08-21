export const CONTACT_LOCATION_IDS = ["yerevan", "avan", "argavand"] as const;

export type ContactLocationId = (typeof CONTACT_LOCATION_IDS)[number];

export type ContactLocationMapCenter = {
  lat: number;
  lng: number;
  zoom: number;
};

export type ContactLocation = {
  id: ContactLocationId;
  address: string;
  phones: readonly string[];
  map: ContactLocationMapCenter;
};

const CONTACT_LOCATION_META: Record<
  ContactLocationId,
  { phones: readonly string[]; map: ContactLocationMapCenter }
> = {
  yerevan: {
    phones: ["+374 98 19 04 06", "+374 93 52 04 06"],
    map: { lat: 40.173852, lng: 44.521961, zoom: 18 },
  },
  avan: {
    phones: ["+374 41 48 04 06", "+374 41 49 04 06"],
    map: { lat: 40.22234, lng: 44.560337, zoom: 18 },
  },
  argavand: {
    phones: ["+374 93 58 04 09", "+374 41 34 04 06"],
    map: { lat: 40.15244, lng: 44.43523, zoom: 17 },
  },
};

export const CONTACT_EMAILS = [
  "marcogrouparmenia@mail.ru",
  "marcofurniture@mail.ru",
] as const;

const LOCATION_HASH_RE = /^#loc-(yerevan|avan|argavand)$/;

export function buildContactLocations(
  addresses: Record<ContactLocationId, string>,
): ContactLocation[] {
  return CONTACT_LOCATION_IDS.map((id) => ({
    id,
    address: addresses[id],
    phones: CONTACT_LOCATION_META[id].phones,
    map: CONTACT_LOCATION_META[id].map,
  }));
}

export function phoneToTelHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/gu, "")}`;
}

export function mapsEmbedUrlForLocation(location: ContactLocation): string {
  const { lat, lng, zoom } = location.map;
  const z = Math.min(21, Math.max(1, Math.round(zoom)));
  return `https://www.google.com/maps?q=${lat},${lng}&z=${z}&output=embed`;
}

export function mapsDirectionsUrlForLocation(location: ContactLocation): string {
  const { lat, lng } = location.map;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const DELIVERY_PHONES = ["+374 41 35 04 06"] as const;

export type ContactPhoneSectionId = ContactLocationId | "delivery";

export type ContactPhoneSection = {
  id: ContactPhoneSectionId;
  label: string;
  phones: readonly string[];
};

export function parseContactLocationHash(hash: string): ContactLocationId | null {
  const match = LOCATION_HASH_RE.exec(hash);
  return match ? (match[1] as ContactLocationId) : null;
}

/** Header phone picker — store branches plus delivery. */
export function buildContactPhoneSections(
  locations: readonly ContactLocation[],
  deliveryLabel: string,
): ContactPhoneSection[] {
  return [
    ...locations.map((location) => ({
      id: location.id,
      label: location.address,
      phones: location.phones,
    })),
    {
      id: "delivery",
      label: deliveryLabel,
      phones: DELIVERY_PHONES,
    },
  ];
}

export function contactLocationMapHref(
  locale: string,
  id: ContactLocationId,
): string {
  return `/${locale}/contact#loc-${id}`;
}
