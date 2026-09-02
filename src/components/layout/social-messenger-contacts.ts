import type { SocialBrandProfile } from "@/components/layout/social-brand-profiles";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

export type SocialMessengerChannel = "telegram" | "whatsapp" | "viber";

export type SocialMessengerMenus = {
  telegram: readonly SocialBrandProfile[];
  whatsapp: readonly SocialBrandProfile[];
  viber: readonly SocialBrandProfile[];
  telegramMenuLabel: string;
  whatsappMenuLabel: string;
  viberMenuLabel: string;
};

type MessengerBranch = {
  id: "argavand" | "yerevan" | "avan";
  phoneDisplay: string;
  phoneDigits: string;
};

/** Branch messenger numbers — order matches the storefront social drawer. */
const MESSENGER_BRANCHES = [
  {
    id: "argavand",
    phoneDisplay: "+374 93 58 04 09",
    phoneDigits: "37493580409",
  },
  {
    id: "yerevan",
    phoneDisplay: "+374 93 52 04 06",
    phoneDigits: "37493520406",
  },
  {
    id: "avan",
    phoneDisplay: "+374 41 49 04 06",
    phoneDigits: "37441490406",
  },
] as const satisfies readonly MessengerBranch[];

function messengerHref(channel: SocialMessengerChannel, phoneDigits: string): string {
  switch (channel) {
    case "telegram":
      return `https://t.me/+${phoneDigits}`;
    case "whatsapp":
      return `https://wa.me/${phoneDigits}`;
    case "viber":
      return `viber://chat?number=${phoneDigits}`;
  }
}

function branchLabel(
  dictionary: Dictionary,
  id: MessengerBranch["id"],
): string {
  return dictionary.header.messengerBranches[id];
}

function buildChannelProfiles(
  dictionary: Dictionary,
  channel: SocialMessengerChannel,
): SocialBrandProfile[] {
  return MESSENGER_BRANCHES.map((branch) => ({
    label: branchLabel(dictionary, branch.id),
    subtitle: branch.phoneDisplay,
    href: messengerHref(channel, branch.phoneDigits),
  }));
}

/**
 * Telegram, WhatsApp, and Viber each open a branch-number drawer
 * (same interaction pattern as Instagram / Facebook brand menus).
 */
export function buildSocialMessengerMenus(
  dictionary: Dictionary,
): SocialMessengerMenus {
  const brands = dictionary.header.socialBrands;

  return {
    telegram: buildChannelProfiles(dictionary, "telegram"),
    whatsapp: buildChannelProfiles(dictionary, "whatsapp"),
    viber: buildChannelProfiles(dictionary, "viber"),
    telegramMenuLabel: brands.telegramMenu,
    whatsappMenuLabel: brands.whatsappMenu,
    viberMenuLabel: brands.viberMenu,
  };
}
