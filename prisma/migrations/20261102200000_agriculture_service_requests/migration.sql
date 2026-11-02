-- Restore the prototype service catalogue and persist versioned customer intake.
ALTER TABLE "panels"
ADD COLUMN "form_version" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "service_requests"
ADD COLUMN "reference_code" TEXT,
ADD COLUMN "form_version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "answers" JSONB NOT NULL DEFAULT '{}'::jsonb,
ADD COLUMN "field_snapshot" JSONB NOT NULL DEFAULT '[]'::jsonb,
ADD COLUMN "assigned_to_id" TEXT,
ADD COLUMN "marketplace_request_id" TEXT;

UPDATE "panels" SET "is_active" = TRUE
WHERE "slug" IN (
  'crop-farming', 'seeds-seedlings', 'fertilizer-soil', 'pest-control', 'irrigation', 'organic-farming',
  'livestock', 'poultry', 'fisheries', 'land-equipment', 'training-advice', 'contract-farming',
  'farm-inputs', 'produce-market', 'wholesale-buyers', 'daily-market-price', 'storage-warehouse',
  'transport-logistics', 'food-processing', 'export-support', 'farm-labour', 'farm-machinery',
  'worker-marketplace', 'farm-finance', 'insurance-claims', 'weather-alerts', 'disaster-support',
  'women-farmers', 'youth-agripreneurs', 'community-reports'
);

CREATE TYPE "ServiceRequestUpdateVisibility" AS ENUM ('CUSTOMER', 'INTERNAL');

CREATE TABLE "service_request_updates" (
  "id" TEXT NOT NULL,
  "request_id" INTEGER NOT NULL,
  "author_id" TEXT,
  "visibility" "ServiceRequestUpdateVisibility" NOT NULL DEFAULT 'CUSTOMER',
  "message_bn" TEXT,
  "message_en" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "service_request_updates_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "service_request_attachments" (
  "id" TEXT NOT NULL,
  "request_id" INTEGER NOT NULL,
  "created_by_id" TEXT NOT NULL,
  "storage_key" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "content_type" TEXT NOT NULL,
  "size_bytes" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "service_request_attachments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "service_requests_reference_code_key" ON "service_requests"("reference_code");
CREATE UNIQUE INDEX "service_requests_marketplace_request_id_key" ON "service_requests"("marketplace_request_id");
CREATE INDEX "service_requests_status_district_created_at_idx" ON "service_requests"("status", "district", "created_at");
CREATE INDEX "service_requests_assigned_to_id_status_idx" ON "service_requests"("assigned_to_id", "status");
CREATE INDEX "service_request_updates_request_id_visibility_created_at_idx" ON "service_request_updates"("request_id", "visibility", "created_at");
CREATE UNIQUE INDEX "service_request_attachments_storage_key_key" ON "service_request_attachments"("storage_key");
CREATE INDEX "service_request_attachments_request_id_created_at_idx" ON "service_request_attachments"("request_id", "created_at");

ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_assigned_to_id_fkey"
FOREIGN KEY ("assigned_to_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_marketplace_request_id_fkey"
FOREIGN KEY ("marketplace_request_id") REFERENCES "marketplace_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "service_request_updates" ADD CONSTRAINT "service_request_updates_request_id_fkey"
FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "service_request_updates" ADD CONSTRAINT "service_request_updates_author_id_fkey"
FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "service_request_attachments" ADD CONSTRAINT "service_request_attachments_request_id_fkey"
FOREIGN KEY ("request_id") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "service_request_attachments" ADD CONSTRAINT "service_request_attachments_created_by_id_fkey"
FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
