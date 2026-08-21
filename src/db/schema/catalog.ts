import { sql } from "drizzle-orm";
import {
  type AnyPgColumn,
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import {
  createdAtColumn,
  deletedAtColumn,
  idColumn,
  updatedAtColumn,
} from "@/db/schema/columns";
import {
  categoryStatusEnum,
  productSalesClassEnum,
  productStatusEnum,
} from "@/db/schema/enums";

export const PRODUCT_TAG_TYPES = ["TEXT", "PERCENT"] as const;
export type ProductTagType = (typeof PRODUCT_TAG_TYPES)[number];

export type ProductTag = {
  id: string;
  type: ProductTagType;
  value: string;
  color: string | null;
};

export const PRODUCT_WARRANTY_YEARS = [0, 1, 2, 3] as const;
export type ProductWarrantyYears = (typeof PRODUCT_WARRANTY_YEARS)[number];

export const ATTRIBUTE_VALUE_KINDS = ["TEXT", "COLOR", "IMAGE"] as const;
export type AttributeValueKind = (typeof ATTRIBUTE_VALUE_KINDS)[number];

export type ProductSpecification = {
  title: string;
  value: string;
};

export type LocaleTranslation = {
  title: string;
  slug: string;
  description?: string;
  specifications?: ProductSpecification[];
  seoTitle?: string;
  seoDescription?: string;
};

export type TranslationsJson = Partial<
  Record<"hy" | "en" | "ru", LocaleTranslation>
>;

export const products = pgTable(
  "products",
  {
    id: idColumn(),
    sku: text("sku").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    priceAmount: integer("price_amount").notNull(),
    compareAtAmount: integer("compare_at_amount"),
    stockOnHand: integer("stock_on_hand").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    version: integer("version").notNull().default(0),
    status: productStatusEnum("status").notNull().default("DRAFT"),
    isFeatured: boolean("is_featured").notNull().default(false),
    isUpcoming: boolean("is_upcoming").notNull().default(false),
    salesClass: productSalesClassEnum("sales_class").notNull().default("RETAIL"),
    warrantyYears: integer("warranty_years").notNull().default(0),
    tags: jsonb("tags").$type<ProductTag[]>().notNull().default(sql`'[]'::jsonb`),
    badgeTranslations: jsonb("badge_translations").$type<
      Partial<Record<"hy" | "en" | "ru", string>>
    >(),
    badgeStyle: text("badge_style"),
    badgePosition: text("badge_position"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    uniqueIndex("products_sku_uidx").on(table.sku),
    index("products_status_created_idx").on(table.status, table.createdAt),
    index("products_stock_idx").on(table.stockOnHand),
    uniqueIndex("products_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("products_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("products_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
    check("products_price_nonneg_chk", sql`${table.priceAmount} >= 0`),
    check(
      "products_compare_nonneg_chk",
      sql`${table.compareAtAmount} IS NULL OR ${table.compareAtAmount} >= 0`,
    ),
    check("products_stock_nonneg_chk", sql`${table.stockOnHand} >= 0`),
    check(
      "products_warranty_years_chk",
      sql`${table.warrantyYears} IN (0, 1, 2, 3)`,
    ),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: idColumn(),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id, {
      onDelete: "restrict",
    }),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    status: categoryStatusEnum("status").notNull().default("ACTIVE"),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    index("categories_parent_idx").on(table.parentId),
    index("categories_status_sort_idx").on(table.status, table.sortOrder),
    uniqueIndex("categories_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("categories_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("categories_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
  ],
);

export const brands = pgTable(
  "brands",
  {
    id: idColumn(),
    sku: text("sku").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    uniqueIndex("brands_sku_uidx").on(table.sku),
    index("brands_created_idx").on(table.createdAt),
    uniqueIndex("brands_slug_hy_uidx")
      .on(sql`(${table.translations}->'hy'->>'slug')`)
      .where(sql`${table.translations}->'hy'->>'slug' IS NOT NULL`),
    uniqueIndex("brands_slug_en_uidx")
      .on(sql`(${table.translations}->'en'->>'slug')`)
      .where(sql`${table.translations}->'en'->>'slug' IS NOT NULL`),
    uniqueIndex("brands_slug_ru_uidx")
      .on(sql`(${table.translations}->'ru'->>'slug')`)
      .where(sql`${table.translations}->'ru'->>'slug' IS NOT NULL`),
  ],
);

export const attributes = pgTable(
  "attributes",
  {
    id: idColumn(),
    key: text("key").notNull(),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
    deletedAt: deletedAtColumn(),
  },
  (table) => [
    uniqueIndex("attributes_key_uidx").on(table.key),
    index("attributes_created_idx").on(table.createdAt),
  ],
);

export const attributeValues = pgTable(
  "attribute_values",
  {
    id: idColumn(),
    attributeId: uuid("attribute_id")
      .notNull()
      .references(() => attributes.id, { onDelete: "restrict" }),
    kind: text("kind").$type<AttributeValueKind>().notNull().default("TEXT"),
    translations: jsonb("translations").$type<TranslationsJson>().notNull(),
    colorHex: text("color_hex"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
    updatedAt: updatedAtColumn(),
  },
  (table) => [
    index("attribute_values_attribute_idx").on(table.attributeId),
    uniqueIndex("attribute_values_color_uidx")
      .on(table.attributeId, table.colorHex)
      .where(sql`${table.colorHex} IS NOT NULL`),
    check(
      "attribute_values_kind_chk",
      sql`${table.kind} IN ('TEXT', 'COLOR', 'IMAGE')`,
    ),
    check(
      "attribute_values_color_hex_chk",
      sql`${table.colorHex} IS NULL OR ${table.colorHex} ~ '^#[0-9A-Fa-f]{6}$'`,
    ),
  ],
);

export const productCategories = pgTable(
  "product_categories",
  {
    id: idColumn(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex("product_categories_uidx").on(
      table.productId,
      table.categoryId,
    ),
    index("product_categories_category_idx").on(table.categoryId),
    uniqueIndex("product_categories_primary_uidx")
      .on(table.productId)
      .where(sql`${table.isPrimary} = true`),
  ],
);

export const productBrands = pgTable(
  "product_brands",
  {
    id: idColumn(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id, { onDelete: "restrict" }),
    isPrimary: boolean("is_primary").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: createdAtColumn(),
  },
  (table) => [
    uniqueIndex("product_brands_uidx").on(table.productId, table.brandId),
    index("product_brands_brand_idx").on(table.brandId),
    uniqueIndex("product_brands_primary_uidx")
      .on(table.productId)
      .where(sql`${table.isPrimary} = true`),
  ],
);
