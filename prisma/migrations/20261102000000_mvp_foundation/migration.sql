-- CreateEnum
CREATE TYPE "SectorStatus" AS ENUM ('LIVE', 'COMING_SOON');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "ListingKind" AS ENUM ('PRODUCE', 'WORKER', 'MACHINERY', 'CONSTRUCTION_MATERIAL', 'CONSTRUCTION_SERVICE');

-- CreateEnum
CREATE TYPE "MarketplaceRequestStatus" AS ENUM ('OPEN', 'QUOTED', 'ACCEPTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CONFIRMED', 'IN_PROGRESS', 'AWAITING_CONFIRMATION', 'COMPLETED', 'CANCELLED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'MOBILE_WALLET', 'OTHER');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('DUE', 'COLLECTED', 'WAIVED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'REVIEW', 'APPROVED');

-- CreateEnum
CREATE TYPE "StaffPermission" AS ENUM ('OPERATIONS', 'FINANCE');

-- AlterTable
UPDATE "user" SET "role" = 'customer', "status" = CASE WHEN "status" IS NULL OR "status" = 'pending' THEN 'active' ELSE "status" END;
ALTER TABLE "user" ALTER COLUMN "role" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'customer',
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- AlterTable
ALTER TABLE "panels" ADD COLUMN     "sector_slug" TEXT NOT NULL DEFAULT 'agriculture-labor';

-- CreateTable
CREATE TABLE "sectors" (
    "slug" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "title_bn" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "status" "SectorStatus" NOT NULL DEFAULT 'COMING_SOON',

    CONSTRAINT "sectors_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "provider_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name_bn" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "bio_bn" TEXT NOT NULL DEFAULT '',
    "bio_en" TEXT NOT NULL DEFAULT '',
    "district" TEXT NOT NULL,
    "upazila" TEXT,
    "status" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provider_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider_capabilities" (
    "id" SERIAL NOT NULL,
    "provider_id" TEXT NOT NULL,
    "sector_slug" TEXT NOT NULL,
    "kind" "ListingKind" NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'PENDING',
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_grants" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "scope_key" TEXT NOT NULL,
    "sector_slug" TEXT,
    "permission" "StaffPermission" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_grants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_listings" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "sector_slug" TEXT NOT NULL,
    "kind" "ListingKind" NOT NULL,
    "title_bn" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL DEFAULT '',
    "description_en" TEXT NOT NULL DEFAULT '',
    "category" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "stock" DECIMAL(12,3) NOT NULL DEFAULT 0,
    "available_from" TIMESTAMP(3),
    "image_key" TEXT,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marketplace_requests" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "sector_slug" TEXT NOT NULL,
    "project_id" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL,
    "district" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "requested_start" TIMESTAMP(3),
    "requested_end" TIMESTAMP(3),
    "status" "MarketplaceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "transport_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "note" TEXT NOT NULL DEFAULT '',
    "expires_at" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "status" "QuoteStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "quote_id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "listing_id" TEXT NOT NULL,
    "project_id" TEXT,
    "quantity" DECIMAL(12,3) NOT NULL,
    "unit" TEXT NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "transport_fee" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "commission_rate" DECIMAL(5,2) NOT NULL,
    "commission_amount" DECIMAL(12,2) NOT NULL,
    "provider_amount" DECIMAL(12,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'CONFIRMED',
    "cancellation_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_records" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "submitted_by_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "paid_at" TIMESTAMP(3) NOT NULL,
    "buyer_confirmed_at" TIMESTAMP(3),
    "provider_confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commission_records" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'DUE',
    "reference" TEXT,
    "collected_by_id" TEXT,
    "collected_at" TIMESTAMP(3),

    CONSTRAINT "commission_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "construction_projects" (
    "id" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "sector_slug" TEXT NOT NULL DEFAULT 'construction',
    "title" TEXT NOT NULL,
    "project_type" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "approximate_area" TEXT,
    "budget" DECIMAL(12,2),
    "starts_at" TIMESTAMP(3),
    "target_ends_at" TIMESTAMP(3),
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "construction_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_milestones" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "amount" DECIMAL(12,2),
    "due_at" TIMESTAMP(3),
    "status" "MilestoneStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_milestones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_documents" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "uploaded_by_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "content_type" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sectors_position_key" ON "sectors"("position");

-- CreateIndex
CREATE UNIQUE INDEX "provider_profiles_user_id_key" ON "provider_profiles"("user_id");

-- CreateIndex
CREATE INDEX "provider_profiles_status_idx" ON "provider_profiles"("status");

-- CreateIndex
CREATE INDEX "provider_profiles_district_idx" ON "provider_profiles"("district");

-- CreateIndex
CREATE INDEX "provider_capabilities_sector_slug_status_idx" ON "provider_capabilities"("sector_slug", "status");

-- CreateIndex
CREATE UNIQUE INDEX "provider_capabilities_provider_id_sector_slug_kind_key" ON "provider_capabilities"("provider_id", "sector_slug", "kind");

-- CreateIndex
CREATE INDEX "staff_grants_user_id_permission_idx" ON "staff_grants"("user_id", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "staff_grants_user_id_permission_scope_key_key" ON "staff_grants"("user_id", "permission", "scope_key");

-- CreateIndex
CREATE INDEX "marketplace_listings_sector_slug_kind_is_published_idx" ON "marketplace_listings"("sector_slug", "kind", "is_published");

-- CreateIndex
CREATE INDEX "marketplace_listings_district_is_published_idx" ON "marketplace_listings"("district", "is_published");

-- CreateIndex
CREATE INDEX "marketplace_listings_category_is_published_idx" ON "marketplace_listings"("category", "is_published");

-- CreateIndex
CREATE INDEX "marketplace_requests_buyer_id_status_idx" ON "marketplace_requests"("buyer_id", "status");

-- CreateIndex
CREATE INDEX "marketplace_requests_provider_id_status_idx" ON "marketplace_requests"("provider_id", "status");

-- CreateIndex
CREATE INDEX "marketplace_requests_sector_slug_status_idx" ON "marketplace_requests"("sector_slug", "status");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_request_id_key" ON "quotes"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_request_id_key" ON "orders"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_quote_id_key" ON "orders"("quote_id");

-- CreateIndex
CREATE INDEX "orders_buyer_id_status_idx" ON "orders"("buyer_id", "status");

-- CreateIndex
CREATE INDEX "orders_provider_id_status_idx" ON "orders"("provider_id", "status");

-- CreateIndex
CREATE INDEX "orders_project_id_idx" ON "orders"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_order_id_key" ON "bookings"("order_id");

-- CreateIndex
CREATE INDEX "bookings_starts_at_ends_at_idx" ON "bookings"("starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "payment_records_order_id_created_at_idx" ON "payment_records"("order_id", "created_at");

-- CreateIndex
CREATE INDEX "payment_records_buyer_confirmed_at_provider_confirmed_at_idx" ON "payment_records"("buyer_confirmed_at", "provider_confirmed_at");

-- CreateIndex
CREATE UNIQUE INDEX "commission_records_order_id_key" ON "commission_records"("order_id");

-- CreateIndex
CREATE INDEX "commission_records_status_collected_at_idx" ON "commission_records"("status", "collected_at");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_order_id_key" ON "reviews"("order_id");

-- CreateIndex
CREATE INDEX "reviews_provider_id_created_at_idx" ON "reviews"("provider_id", "created_at");

-- CreateIndex
CREATE INDEX "construction_projects_owner_id_status_idx" ON "construction_projects"("owner_id", "status");

-- CreateIndex
CREATE INDEX "project_milestones_project_id_status_idx" ON "project_milestones"("project_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "project_documents_storage_key_key" ON "project_documents"("storage_key");

-- CreateIndex
CREATE INDEX "project_documents_project_id_created_at_idx" ON "project_documents"("project_id", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_created_at_idx" ON "notifications"("user_id", "read_at", "created_at");

-- Create a string-keyed activity log for new marketplace and admin operations.
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_type" TEXT,
    "entity_id" TEXT,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "activity_logs_user_id_created_at_idx" ON "activity_logs"("user_id", "created_at");
CREATE INDEX "activity_logs_entity_type_entity_id_idx" ON "activity_logs"("entity_type", "entity_id");

-- Seed the fixed sector catalogue before panel and capability foreign keys are created.
INSERT INTO "sectors" ("slug", "position", "title_bn", "title_en", "icon", "status") VALUES
('family-household', 1, 'পরিবার ও গৃহস্থালি', 'Family & Household', '🏠', 'COMING_SOON'),
('ecommerce-b2b', 2, 'ই-কমার্স ও B2B', 'E-Commerce & B2B', '🛒', 'COMING_SOON'),
('repair-services', 3, 'মেরামত সেবা', 'Repair Services', '🔧', 'COMING_SOON'),
('agriculture-labor', 4, 'কৃষি ও শ্রমিক', 'Agriculture & Labor', '🌾', 'LIVE'),
('construction', 5, 'নির্মাণ', 'Construction', '🏗️', 'LIVE'),
('transport-bus', 6, 'পরিবহন ও বাস টিকিট', 'Transport & Bus Tickets', '🚌', 'COMING_SOON'),
('tourism', 7, 'ট্যুরিজম', 'Tourism', '🧳', 'COMING_SOON'),
('healthcare', 8, 'স্বাস্থ্যসেবা', 'Healthcare', '🏥', 'COMING_SOON'),
('events', 9, 'ইভেন্ট', 'Events', '🎉', 'COMING_SOON'),
('isp-utility', 10, 'ISP ও ইউটিলিটি', 'ISP & Utility', '🌐', 'COMING_SOON'),
('jobs-professionals', 11, 'চাকরি ও পেশাজীবী', 'Jobs & Professionals', '💼', 'COMING_SOON'),
('social-feed', 12, 'সামাজিক ফিড', 'Social Feed', '💬', 'COMING_SOON'),
('payment-compliance', 13, 'পেমেন্ট ও কমপ্লায়েন্স', 'Payment & Compliance', '💳', 'COMING_SOON');
-- AddForeignKey
ALTER TABLE "panels" ADD CONSTRAINT "panels_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_profiles" ADD CONSTRAINT "provider_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_capabilities" ADD CONSTRAINT "provider_capabilities_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider_capabilities" ADD CONSTRAINT "provider_capabilities_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_grants" ADD CONSTRAINT "staff_grants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_grants" ADD CONSTRAINT "staff_grants_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_listings" ADD CONSTRAINT "marketplace_listings_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "marketplace_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marketplace_requests" ADD CONSTRAINT "marketplace_requests_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "marketplace_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "marketplace_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "marketplace_listings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_records" ADD CONSTRAINT "payment_records_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_records" ADD CONSTRAINT "commission_records_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commission_records" ADD CONSTRAINT "commission_records_collected_by_id_fkey" FOREIGN KEY ("collected_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_sector_slug_fkey" FOREIGN KEY ("sector_slug") REFERENCES "sectors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
