-- Store uploaded payment evidence as a private object key.
ALTER TABLE "payment_records" ADD COLUMN "receipt_key" TEXT;

CREATE UNIQUE INDEX "payment_records_receipt_key_key" ON "payment_records"("receipt_key");
