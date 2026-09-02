import { describe, expect, it } from "vitest";

import { buildSocialMessengerMenus } from "@/components/layout/social-messenger-contacts";
import { getDictionary } from "@/lib/i18n/get-dictionary";

describe("buildSocialMessengerMenus", () => {
  it("maps Telegram, WhatsApp, and Viber to the three branch numbers", () => {
    const menus = buildSocialMessengerMenus(getDictionary("hy"));

    expect(menus.telegram).toEqual([
      {
        label: "Արգավանդ",
        subtitle: "+374 93 58 04 09",
        href: "https://t.me/+37493580409",
      },
      {
        label: "Ալեք Մանուկյան",
        subtitle: "+374 93 52 04 06",
        href: "https://t.me/+37493520406",
      },
      {
        label: "Ավան",
        subtitle: "+374 41 49 04 06",
        href: "https://t.me/+37441490406",
      },
    ]);

    expect(menus.whatsapp.map((item) => item.href)).toEqual([
      "https://wa.me/37493580409",
      "https://wa.me/37493520406",
      "https://wa.me/37441490406",
    ]);

    expect(menus.viber.map((item) => item.href)).toEqual([
      "viber://chat?number=37493580409",
      "viber://chat?number=37493520406",
      "viber://chat?number=37441490406",
    ]);
  });
});
