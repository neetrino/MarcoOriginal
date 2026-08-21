import {
  type ContactLocation,
  type ContactLocationId,
} from "@/features/contact/content/contact-locations";

export const STORE_DIRECTORY_ORDER = [
  "yerevan",
  "argavand",
  "avan",
] as const satisfies readonly ContactLocationId[];

export const STORE_IMAGE_SRC: Record<ContactLocationId, string> = {
  yerevan: "/assets/stores/alec-manoogian.webp",
  argavand: "/assets/stores/parakar.webp",
  avan: "/assets/stores/avan.webp",
};

export function orderStoreLocations(
  locations: readonly ContactLocation[],
): ContactLocation[] {
  const byId = new Map(
    locations.map((location) => [location.id, location] as const),
  );

  return STORE_DIRECTORY_ORDER.flatMap((id) => {
    const location = byId.get(id);
    return location ? [location] : [];
  });
}
