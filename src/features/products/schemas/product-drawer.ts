import { z } from "zod";

import {
  HEX_COLOR_PATTERN,
  MAX_PRODUCT_TAGS,
  MAX_TAG_VALUE_LENGTH,
  PRODUCT_SALES_CLASSES,
  PRODUCT_TAG_TYPES,
  PRODUCT_WARRANTY_YEARS,
} from "@/features/products/domain/product-presentation";
import {
  MAX_PRODUCT_SPECS,
  MAX_SPEC_TITLE_LENGTH,
  MAX_SPEC_VALUE_LENGTH,
} from "@/features/products/domain/product-specs";

const productTagSchema = z
  .object({
    id: z.string().trim().min(1).max(64),
    type: z.enum(PRODUCT_TAG_TYPES),
    value: z.string().trim().max(MAX_TAG_VALUE_LENGTH),
    color: z
      .union([
        z.string().trim().regex(HEX_COLOR_PATTERN),
        z.literal(""),
        z.null(),
      ])
      .optional()
      .transform((value) => (value ? value.toUpperCase() : null)),
  })
  .superRefine((tag, ctx) => {
    if (!tag.value) return;
    if (tag.type !== "PERCENT") return;
    if (!/^\d{1,2}$/.test(tag.value)) {
      ctx.addIssue({
        code: "custom",
        message: "Percent tags must be a whole number from 1 to 99.",
        path: ["value"],
      });
      return;
    }
    const amount = Number(tag.value);
    if (amount < 1 || amount > 99) {
      ctx.addIssue({
        code: "custom",
        message: "Percent tags must be a whole number from 1 to 99.",
        path: ["value"],
      });
    }
  });

export const productUpsertSchema = z.object({
  sku: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().min(1).max(200),
  description: z.string().trim().max(8000).optional(),
  priceAmount: z.number().int().nonnegative(),
  compareAtAmount: z.number().int().nonnegative().nullable(),
  categoryIds: z.array(z.string().uuid()),
  brandIds: z.array(z.string().uuid()).default([]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  salesClass: z.enum(PRODUCT_SALES_CLASSES),
  warrantyYears: z.number().int().refine(
    (value): value is (typeof PRODUCT_WARRANTY_YEARS)[number] =>
      (PRODUCT_WARRANTY_YEARS as readonly number[]).includes(value),
    { message: "Warranty must be 0, 1, 2, or 3 years." },
  ),
  tags: z.array(productTagSchema).max(MAX_PRODUCT_TAGS),
  specifications: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(64).optional(),
        title: z.string().trim().max(MAX_SPEC_TITLE_LENGTH),
        value: z.string().trim().max(MAX_SPEC_VALUE_LENGTH),
      }),
    )
    .max(MAX_PRODUCT_SPECS),
  primaryExistingId: z.string().uuid().nullable(),
  primaryNewIndex: z.number().int().nullable(),
  removeImageIds: z.array(z.string().uuid()),
});

export type ProductUpsertInput = z.infer<typeof productUpsertSchema>;
