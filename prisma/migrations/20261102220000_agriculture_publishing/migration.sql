-- CreateEnum
CREATE TYPE "AgriculturePublicationStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "AgricultureUpdateKind" AS ENUM ('NEWS', 'ADVICE', 'WEATHER_ALERT');

-- CreateTable
CREATE TABLE "agriculture_market_prices" (
    "id" TEXT NOT NULL,
    "product_bn" TEXT NOT NULL,
    "product_en" TEXT NOT NULL,
    "market" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "observed_at" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "status" "AgriculturePublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "source_request_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agriculture_market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agriculture_updates" (
    "id" TEXT NOT NULL,
    "kind" "AgricultureUpdateKind" NOT NULL,
    "title_bn" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "body_bn" TEXT NOT NULL,
    "body_en" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "AgriculturePublicationStatus" NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agriculture_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "agriculture_market_prices_source_request_id_key" ON "agriculture_market_prices"("source_request_id");

-- CreateIndex
CREATE INDEX "agriculture_market_prices_status_observed_at_idx" ON "agriculture_market_prices"("status", "observed_at");

-- CreateIndex
CREATE INDEX "agriculture_updates_status_published_at_expires_at_idx" ON "agriculture_updates"("status", "published_at", "expires_at");

-- AddForeignKey
ALTER TABLE "agriculture_market_prices" ADD CONSTRAINT "agriculture_market_prices_source_request_id_fkey" FOREIGN KEY ("source_request_id") REFERENCES "service_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "marketplace_listings_sector_slug_kind_is_published_archived_at_" RENAME TO "marketplace_listings_sector_slug_kind_is_published_archived_idx";

