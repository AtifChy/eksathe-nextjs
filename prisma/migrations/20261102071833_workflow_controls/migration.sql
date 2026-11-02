-- CreateEnum
CREATE TYPE "ListingModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "marketplace_listings" ADD COLUMN     "moderation_status" "ListingModerationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cancel_confirmed_at" TIMESTAMP(3),
ADD COLUMN     "cancel_requested_at" TIMESTAMP(3),
ADD COLUMN     "cancel_requested_by_id" TEXT;

-- AlterTable
ALTER TABLE "payment_records" ADD COLUMN     "refund_amount" DECIMAL(12,2),
ADD COLUMN     "refund_reference" TEXT,
ADD COLUMN     "refunded_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sectors" ADD COLUMN     "commission_rate" DECIMAL(5,2) NOT NULL DEFAULT 10.00;
