-- Allow multiple HERO_MOBILE assets per hero slide (mobile home carousel).
DROP INDEX IF EXISTS "media_assets_hero_mobile_uidx";--> statement-breakpoint
CREATE INDEX "media_assets_hero_mobile_idx" ON "media_assets" USING btree ("hero_slide_id","sort_order") WHERE "media_assets"."hero_slide_id" IS NOT NULL AND "media_assets"."role" = 'HERO_MOBILE';
