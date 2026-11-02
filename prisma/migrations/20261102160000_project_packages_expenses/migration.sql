-- Group project invitations into comparable work packages.
ALTER TABLE "marketplace_requests" ADD COLUMN "package_label" TEXT;
ALTER TABLE "orders" ADD COLUMN "package_label" TEXT;

CREATE UNIQUE INDEX "orders_project_id_package_label_key" ON "orders"("project_id", "package_label");

-- Keep project-only expense entries private to the project owner.
CREATE TABLE "project_expenses" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_expenses_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "project_expenses_project_id_occurred_at_idx" ON "project_expenses"("project_id", "occurred_at");

ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "construction_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "project_expenses" ADD CONSTRAINT "project_expenses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
