import { describe, expect, it } from "vitest";

import { buildContactLocations } from "@/features/contact/content/contact-locations";
import { orderStoreLocations } from "@/features/stores/content/store-directory";

const addresses = {
  yerevan: "23 Alek Manukyan St, Yerevan",
  avan: "39/7 Hrachya Acharyan St, Avan, Yerevan",
  argavand: "1 Airport St, Argavand",
};

describe("orderStoreLocations", () => {
  it("returns Yerevan, Argavand, then Avan", () => {
    const ordered = orderStoreLocations(buildContactLocations(addresses));

    expect(ordered.map((location) => location.id)).toEqual([
      "yerevan",
      "argavand",
      "avan",
    ]);
  });
});
