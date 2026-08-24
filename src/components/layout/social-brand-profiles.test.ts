import { describe, expect, it } from "vitest";

import { buildSocialBrandMenus } from "@/components/layout/social-brand-profiles";
import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("buildSocialBrandMenus", () => {
  it("maps Instagram and Facebook to the two brand profiles", () => {
    const menus = buildSocialBrandMenus(getDictionary("en"));

    expect(menus.instagram).toEqual([
      {
        label: "Marco Group",
        href: "https://www.instagram.com/_marcogroup_/",
      },
      {
        label: "Marco Electronics",
        href: "https://www.instagram.com/marco_electronics/",
      },
    ]);
    expect(menus.facebook).toEqual([
      {
        label: "Marco Group",
        href: "https://www.facebook.com/marcofurniture?locale=ru_RU",
      },
      {
        label: "Marco Electronics",
        href: "https://www.facebook.com/marcoelectronicss?locale=ru_RU",
      },
    ]);
  });
});
