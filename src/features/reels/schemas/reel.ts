import { z } from "zod";

import { locales } from "@/lib/i18n/config";

export const upsertReelSchema = z.object({
  editingLocale: z.enum(locales).default("en"),
  title: z.string().trim().max(200).default(""),
});

export type UpsertReelFormInput = z.input<typeof upsertReelSchema>;
export type UpsertReelInput = z.output<typeof upsertReelSchema>;

export const reelIdSchema = z.object({
  reelId: z.string().uuid(),
});

export type ReelIdInput = z.infer<typeof reelIdSchema>;
