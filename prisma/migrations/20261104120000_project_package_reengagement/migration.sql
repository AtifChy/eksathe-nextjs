DROP INDEX IF EXISTS "orders_package_id_key";

CREATE UNIQUE INDEX "orders_one_active_per_package_key"
ON "orders"("package_id")
WHERE "package_id" IS NOT NULL AND "status" <> 'CANCELLED';
