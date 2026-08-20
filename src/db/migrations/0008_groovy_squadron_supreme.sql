ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_payload_chk";--> statement-breakpoint
ALTER TABLE "attribute_values" DROP CONSTRAINT "attribute_values_kind_chk";--> statement-breakpoint
DROP INDEX "attribute_values_color_uidx";--> statement-breakpoint
ALTER TABLE "attribute_values" ALTER COLUMN "kind" SET DEFAULT 'TEXT';--> statement-breakpoint
ALTER TABLE "attribute_values" ADD COLUMN "translations" jsonb;--> statement-breakpoint
UPDATE "attribute_values"
SET "translations" = jsonb_build_object(
  'hy', jsonb_build_object('title', coalesce("color_hex", 'value'), 'slug', 'value'),
  'en', jsonb_build_object('title', coalesce("color_hex", 'value'), 'slug', 'value'),
  'ru', jsonb_build_object('title', coalesce("color_hex", 'value'), 'slug', 'value')
)
WHERE "translations" IS NULL;--> statement-breakpoint
ALTER TABLE "attribute_values" ALTER COLUMN "translations" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "attribute_values_color_uidx" ON "attribute_values" USING btree ("attribute_id","color_hex") WHERE "attribute_values"."color_hex" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_color_hex_chk" CHECK ("attribute_values"."color_hex" IS NULL OR "attribute_values"."color_hex" ~ '^#[0-9A-Fa-f]{6}$');--> statement-breakpoint
ALTER TABLE "attribute_values" ADD CONSTRAINT "attribute_values_kind_chk" CHECK ("attribute_values"."kind" IN ('TEXT', 'COLOR', 'IMAGE'));