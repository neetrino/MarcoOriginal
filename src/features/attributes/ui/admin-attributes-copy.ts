import type { getDictionary } from "@/lib/i18n/get-dictionary";

export type AdminAttributesCopy = ReturnType<
  typeof getDictionary
>["admin"]["attributes"];
