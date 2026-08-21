import { describe, expect, it } from "vitest";

import type { AdminDeliveryLocation } from "@/features/delivery/application/queries";
import {
  createEmptyDraft,
  draftMatchesLocation,
  isDeliveryEditorDirty,
  locationToDraft,
  locationsResetKey,
  parseDraftInput,
  planDeliverySave,
} from "@/features/delivery/ui/delivery-location-draft";

function location(
  overrides: Partial<AdminDeliveryLocation> = {},
): AdminDeliveryLocation {
  return {
    id: "loc-1",
    country: "Armenia",
    city: "Yerevan",
    priceAmount: 1500,
    freeThresholdAmount: 50000,
    priority: 1,
    ...overrides,
  };
}

describe("delivery location drafts", () => {
  it("maps a persisted location and treats an identical draft as clean", () => {
    const original = location();
    const draft = locationToDraft(original);

    expect(draft.persistedId).toBe("loc-1");
    expect(draftMatchesLocation(draft, original)).toBe(true);
    expect(isDeliveryEditorDirty([original], [draft])).toBe(false);
  });

  it("starts a new destination with Armenia and a 1000 AMD price", () => {
    const draft = createEmptyDraft();

    expect(draft.persistedId).toBeNull();
    expect(draft.country).toBe("Armenia");
    expect(draft.city).toBe("");
    expect(draft.priceAmount).toBe("1000");
    expect(parseDraftInput(draft).ok).toBe(false);
  });

  it("rejects an empty city and accepts a complete draft", () => {
    const draft = locationToDraft(location({ city: "  " }));
    expect(parseDraftInput(draft).ok).toBe(false);

    const valid = parseDraftInput(locationToDraft(location()));
    expect(valid).toEqual({
      ok: true,
      value: {
        country: "Armenia",
        city: "Yerevan",
        priceAmount: 1500,
        freeThresholdAmount: 50000,
      },
    });
  });

  it("changes the reset key when persisted fields change", () => {
    const original = location();
    expect(locationsResetKey([original])).not.toBe(
      locationsResetKey([{ ...original, priceAmount: 1800 }]),
    );
  });

  it("plans create, update, and delete against the persisted list", () => {
    const yerevan = location();
    const gyumri = location({
      id: "loc-2",
      city: "Gyumri",
      priceAmount: 2000,
      freeThresholdAmount: null,
    });
    const edited = locationToDraft({ ...yerevan, priceAmount: 1800 });
    const created = {
      ...createEmptyDraft(),
      city: "Vanadzor",
      priceAmount: "1000",
    };

    const plan = planDeliverySave([yerevan, gyumri], [edited, created]);
    expect(plan.ok).toBe(true);
    if (!plan.ok) return;

    expect(plan.value.toDelete).toEqual(["loc-2"]);
    expect(plan.value.toCreate).toEqual([
      {
        country: "Armenia",
        city: "Vanadzor",
        priceAmount: 1000,
        freeThresholdAmount: null,
      },
    ]);
    expect(plan.value.toUpdate).toEqual([
      {
        id: "loc-1",
        input: {
          country: "Armenia",
          city: "Yerevan",
          priceAmount: 1800,
          freeThresholdAmount: 50000,
        },
      },
    ]);
  });
});
