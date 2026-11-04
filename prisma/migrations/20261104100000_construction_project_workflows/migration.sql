-- DropIndex
DROP INDEX "orders_project_id_package_label_key";

-- AlterTable
ALTER TABLE "marketplace_requests" ADD COLUMN "package_id" TEXT;
ALTER TABLE "orders" ADD COLUMN "package_id" TEXT;
ALTER TABLE "construction_projects" ADD COLUMN "handed_over_at" TIMESTAMP(3);
ALTER TABLE "project_milestones" ADD COLUMN "assigned_provider_id" TEXT;

-- CreateTable
CREATE TABLE "project_packages" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "kind" "ListingKind",
    "service_slug" TEXT,
    "preferred_listing_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_packages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "project_photos" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_photos_pkey" PRIMARY KEY ("id")
);

-- Backfill one stable package for each project and legacy package label.
WITH package_sources AS (
    SELECT r."project_id", COALESCE(r."package_label", 'Legacy request ' || r."id") AS label,
           r."created_at", listing."kind"::TEXT AS kind
    FROM "marketplace_requests" r
    JOIN "marketplace_listings" listing ON listing."id" = r."listing_id"
    WHERE r."project_id" IS NOT NULL
    UNION ALL
    SELECT o."project_id", COALESCE(o."package_label", 'Legacy request ' || o."request_id") AS label,
           o."created_at", listing."kind"::TEXT AS kind
    FROM "orders" o
    JOIN "marketplace_listings" listing ON listing."id" = o."listing_id"
    WHERE o."project_id" IS NOT NULL
), grouped_packages AS (
    SELECT "project_id", label, MIN("created_at") AS created_at,
           CASE WHEN COUNT(DISTINCT kind) = 1 THEN MIN(kind)::"ListingKind" ELSE NULL END AS kind
    FROM package_sources
    GROUP BY "project_id", label
)
INSERT INTO "project_packages" ("id", "project_id", "label", "kind", "created_at")
SELECT 'legacy-' || md5("project_id" || chr(31) || label), "project_id", label, kind, created_at
FROM grouped_packages;

UPDATE "marketplace_requests" request
SET "package_id" = package."id"
FROM "project_packages" package
WHERE request."project_id" = package."project_id"
  AND package."label" = COALESCE(request."package_label", 'Legacy request ' || request."id");

UPDATE "orders" order_record
SET "package_id" = package."id"
FROM "project_packages" package
WHERE order_record."project_id" = package."project_id"
  AND package."label" = COALESCE(order_record."package_label", 'Legacy request ' || order_record."request_id");

-- Give historical milestones to the first engaged construction service provider.
UPDATE "project_milestones" milestone
SET "assigned_provider_id" = (
    SELECT order_record."provider_id"
    FROM "orders" order_record
    JOIN "marketplace_listings" listing ON listing."id" = order_record."listing_id"
    WHERE order_record."project_id" = milestone."project_id"
      AND listing."kind" = 'CONSTRUCTION_SERVICE'
      AND order_record."status" <> 'CANCELLED'
    ORDER BY order_record."created_at", order_record."id"
    LIMIT 1
)
WHERE EXISTS (
    SELECT 1
    FROM "orders" order_record
    JOIN "marketplace_listings" listing ON listing."id" = order_record."listing_id"
    WHERE order_record."project_id" = milestone."project_id"
      AND listing."kind" = 'CONSTRUCTION_SERVICE'
      AND order_record."status" <> 'CANCELLED'
);

-- CreateIndex
CREATE INDEX "project_packages_project_id_created_at_idx" ON "project_packages"("project_id", "created_at");
CREATE UNIQUE INDEX "project_packages_project_id_label_key" ON "project_packages"("project_id", "label");
CREATE UNIQUE INDEX "project_photos_storage_key_key" ON "project_photos"("storage_key");
CREATE INDEX "project_photos_project_id_created_at_idx" ON "project_photos"("project_id", "created_at");
CREATE UNIQUE INDEX "orders_package_id_key" ON "orders"("package_id");

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "project_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orders" ADD CONSTRAINT "orders_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "project_packages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "project_packages" ADD CONSTRAINT "project_packages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_packages" ADD CONSTRAINT "project_packages_preferred_listing_id_fkey" FOREIGN KEY ("preferred_listing_id") REFERENCES "marketplace_listings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_assigned_provider_id_fkey" FOREIGN KEY ("assigned_provider_id") REFERENCES "provider_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_photos" ADD CONSTRAINT "project_photos_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
