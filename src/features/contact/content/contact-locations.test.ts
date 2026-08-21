import { describe, expect, it } from "vitest";

import {
  buildContactLocations,
  buildContactPhoneSections,
  contactLocationMapHref,
  mapsDirectionsUrlForLocation,
} from "@/features/contact/content/contact-locations";

describe("mapsDirectionsUrlForLocation", () => {
  it("builds a Google Maps directions URL from coordinates", () => {
    const locations = buildContactLocations({
      yerevan: "23 Alek Manukyan St, Yerevan",
      avan: "39/7 Hrachya Acharyan St, Avan, Yerevan",
      argavand: "1 Airport St, Argavand",
    });
    const yerevan = locations.find((location) => location.id === "yerevan");

    expect(yerevan).toEqual(
      expect.objectContaining({ map: { lat: 40.173852, lng: 44.521961, zoom: 18 } }),
    );
    expect(yerevan && mapsDirectionsUrlForLocation(yerevan)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=40.173852,44.521961",
    );
  });
});

describe("header contact helpers", () => {
  it("adds a delivery section after store phones", () => {
    const locations = buildContactLocations({
      yerevan: "Yerevan",
      avan: "Avan",
      argavand: "Argavand",
    });
    const sections = buildContactPhoneSections(locations, "For delivery");

    expect(sections).toHaveLength(4);
    expect(sections[3]).toEqual({
      id: "delivery",
      label: "For delivery",
      phones: ["+374 41 35 04 06"],
    });
  });

  it("builds a locale contact map hash href", () => {
    expect(contactLocationMapHref("hy", "yerevan")).toBe("/hy/contact#loc-yerevan");
  });
});
