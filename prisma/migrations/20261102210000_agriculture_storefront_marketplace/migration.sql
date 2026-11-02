-- Add storefront imagery and safe listing archiving without changing order snapshots.
ALTER TABLE "provider_profiles"
ADD COLUMN "profile_image_key" TEXT,
ADD COLUMN "cover_image_key" TEXT;

ALTER TABLE "marketplace_listings"
ADD COLUMN "archived_at" TIMESTAMP(3);

DROP INDEX IF EXISTS "marketplace_listings_sector_slug_kind_is_published_idx";
CREATE INDEX "marketplace_listings_sector_slug_kind_is_published_archived_at_idx"
ON "marketplace_listings"("sector_slug", "kind", "is_published", "archived_at");
