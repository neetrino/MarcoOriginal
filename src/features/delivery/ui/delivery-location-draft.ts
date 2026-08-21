import type { AdminDeliveryLocation } from "@/features/delivery/application/queries";
import {
  deliveryLocationSchema,
  type DeliveryLocationInput,
} from "@/features/delivery/schemas";
import { err, ok, type Result } from "@/lib/result";

const DEFAULT_COUNTRY = "Armenia";
const DEFAULT_PRICE_AMOUNT = "1000";

export type DeliveryLocationField =
  | "country"
  | "city"
  | "priceAmount"
  | "freeThresholdAmount";

export type DeliveryLocationDraft = {
  clientId: string;
  persistedId: string | null;
  country: string;
  city: string;
  priceAmount: string;
  freeThresholdAmount: string;
};

export type DeliverySavePlan = {
  toCreate: DeliveryLocationInput[];
  toUpdate: { id: string; input: DeliveryLocationInput }[];
  toDelete: string[];
};

function amountString(value: number | null): string {
  return value == null ? "" : String(value);
}

/** Stable key so the editor remounts after a successful server refresh. */
export function locationsResetKey(locations: AdminDeliveryLocation[]): string {
  return locations
    .map((location) =>
      [
        location.id,
        location.country,
        location.city,
        location.priceAmount,
        location.freeThresholdAmount ?? "",
      ].join(":"),
    )
    .join("|");
}

/** Maps a persisted location into an editable draft row. */
export function locationToDraft(
  location: AdminDeliveryLocation,
): DeliveryLocationDraft {
  return {
    clientId: location.id,
    persistedId: location.id,
    country: location.country,
    city: location.city,
    priceAmount: amountString(location.priceAmount),
    freeThresholdAmount: amountString(location.freeThresholdAmount),
  };
}

/** Creates a blank destination with the Armenia / 1000 AMD defaults. */
export function createEmptyDraft(): DeliveryLocationDraft {
  return {
    clientId: crypto.randomUUID(),
    persistedId: null,
    country: DEFAULT_COUNTRY,
    city: "",
    priceAmount: DEFAULT_PRICE_AMOUNT,
    freeThresholdAmount: "",
  };
}

/** Validates a draft against the delivery location write schema. */
export function parseDraftInput(
  draft: DeliveryLocationDraft,
): Result<DeliveryLocationInput> {
  const parsed = deliveryLocationSchema.safeParse({
    country: draft.country,
    city: draft.city,
    priceAmount: draft.priceAmount,
    freeThresholdAmount: draft.freeThresholdAmount,
  });

  if (!parsed.success) {
    return err("VALIDATION", "Invalid delivery location.");
  }

  return ok(parsed.data);
}

export function draftMatchesLocation(
  draft: DeliveryLocationDraft,
  location: AdminDeliveryLocation,
): boolean {
  return (
    draft.persistedId === location.id &&
    draft.country === location.country &&
    draft.city === location.city &&
    draft.priceAmount === amountString(location.priceAmount) &&
    draft.freeThresholdAmount === amountString(location.freeThresholdAmount)
  );
}

/** True when the editor differs from the last persisted locations. */
export function isDeliveryEditorDirty(
  originals: AdminDeliveryLocation[],
  drafts: DeliveryLocationDraft[],
): boolean {
  if (drafts.length !== originals.length) return true;

  return drafts.some((draft, index) => {
    const original = originals[index];
    return original == null || !draftMatchesLocation(draft, original);
  });
}

/** Builds create / update / delete batches from the current draft list. */
export function planDeliverySave(
  originals: AdminDeliveryLocation[],
  drafts: DeliveryLocationDraft[],
): Result<DeliverySavePlan> {
  const toCreate: DeliveryLocationInput[] = [];
  const toUpdate: { id: string; input: DeliveryLocationInput }[] = [];
  const originalById = new Map(
    originals.map((location) => [location.id, location]),
  );
  const keptIds = new Set<string>();

  for (const draft of drafts) {
    const parsed = parseDraftInput(draft);
    if (!parsed.ok) return parsed;

    if (draft.persistedId == null) {
      toCreate.push(parsed.value);
      continue;
    }

    keptIds.add(draft.persistedId);
    const original = originalById.get(draft.persistedId);
    if (original && !draftMatchesLocation(draft, original)) {
      toUpdate.push({ id: draft.persistedId, input: parsed.value });
    }
  }

  return ok({
    toCreate,
    toUpdate,
    toDelete: originals
      .filter((location) => !keptIds.has(location.id))
      .map((location) => location.id),
  });
}
