export const FOOTER_CONTACT_PHONE_ICON_SRC = "/icons/footer-social/contact-phone.svg";
export const FOOTER_CONTACT_MAIL_ICON_SRC = "/icons/footer-social/contact-mail.svg";

export const FOOTER_PAYMENT_STRIP_SRC =
  "/assets/payments/footer-payment-methods.webp";
export const FOOTER_PAYMENT_STRIP_WIDTH_PX = 1340;
export const FOOTER_PAYMENT_STRIP_HEIGHT_PX = 164;

type FooterSocialTileSpec = {
  hrefKey: "instagram" | "facebook" | "telegram" | "whatsapp" | "viber";
  src: string;
  labelKey: "instagram" | "facebook" | "telegram" | "whatsapp" | "viber";
  kind: "full" | "viberGlyph";
};

export const FOOTER_SOCIAL_TILE_SPECS: readonly FooterSocialTileSpec[] = [
  {
    hrefKey: "instagram",
    labelKey: "instagram",
    src: "/icons/footer-social/instagram.svg",
    kind: "full",
  },
  {
    hrefKey: "facebook",
    labelKey: "facebook",
    src: "/icons/footer-social/facebook.svg",
    kind: "full",
  },
  {
    hrefKey: "telegram",
    labelKey: "telegram",
    src: "/icons/footer-social/telegram.svg",
    kind: "full",
  },
  {
    hrefKey: "whatsapp",
    labelKey: "whatsapp",
    src: "/icons/footer-social/whatsapp.svg",
    kind: "full",
  },
  {
    hrefKey: "viber",
    labelKey: "viber",
    src: "/icons/footer-social/viber-glyph.svg",
    kind: "viberGlyph",
  },
] as const;
