import {
  PRODUCT_TAG_TYPES,
  PRODUCT_WARRANTY_YEARS,
  type ProductTag,
  type ProductTagType,
  type ProductWarrantyYears,
} from "@/db/schema";

export const PRODUCT_SALES_CLASSES = ["RETAIL", "WHOLESALE"] as const;
export type ProductSalesClass = (typeof PRODUCT_SALES_CLASSES)[number];

export const MAX_PRODUCT_TAGS = 8;
export const MAX_TAG_VALUE_LENGTH = 40;
export const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export {
  PRODUCT_TAG_TYPES,
  PRODUCT_WARRANTY_YEARS,
  type ProductTag,
  type ProductTagType,
  type ProductWarrantyYears,
};

export function isProductSalesClass(value: string): value is ProductSalesClass {
  return (PRODUCT_SALES_CLASSES as readonly string[]).includes(value);
}

export function isProductWarrantyYears(
  value: number,
): value is ProductWarrantyYears {
  return (PRODUCT_WARRANTY_YEARS as readonly number[]).includes(value);
}

export function isProductTagType(value: string): value is ProductTagType {
  return (PRODUCT_TAG_TYPES as readonly string[]).includes(value);
}

export function isHexColor(value: string): boolean {
  return HEX_COLOR_PATTERN.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTagColor(value: unknown): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string" || !isHexColor(value)) return null;
  return value.toUpperCase();
}

function parseTagValue(type: ProductTagType, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().slice(0, MAX_TAG_VALUE_LENGTH);
  if (!value) return null;
  if (type === "PERCENT") {
    if (!/^\d{1,2}$/.test(value)) return null;
    const amount = Number(value);
    if (amount < 1 || amount > 99) return null;
  }
  return value;
}

/** Parses persisted product tags, dropping invalid or empty entries. */
export function parseProductTags(value: unknown): ProductTag[] {
  if (!Array.isArray(value)) return [];
  const tags: ProductTag[] = [];
  for (const entry of value) {
    if (tags.length >= MAX_PRODUCT_TAGS) break;
    if (!isRecord(entry)) continue;
    if (typeof entry.id !== "string" || entry.id.length === 0) continue;
    if (typeof entry.type !== "string" || !isProductTagType(entry.type)) {
      continue;
    }
    const parsedValue = parseTagValue(entry.type, entry.value);
    if (!parsedValue) continue;
    tags.push({
      id: entry.id,
      type: entry.type,
      value: parsedValue,
      color: parseTagColor(entry.color),
    });
  }
  return tags;
}

/** Black or white text for a hex badge background. */
export function contrastTextOnHex(hex: string): "#111827" | "#FFFFFF" {
  const normalized = hex.replace("#", "");
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6 ? "#111827" : "#FFFFFF";
}

export function productTagLabel(tag: ProductTag): string {
  return tag.type === "PERCENT" ? `${tag.value}%` : tag.value;
}

export function createDraftProductTag(): ProductTag {
  return {
    id: crypto.randomUUID(),
    type: "TEXT",
    value: "",
    color: null,
  };
}
