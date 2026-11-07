ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "entity_key" TEXT;
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_sellers" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_sellers_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title_bn" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_categories_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_products" (
    "id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "title_bn" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_bn" TEXT NOT NULL DEFAULT '',
    "description_en" TEXT NOT NULL DEFAULT '',
    "unit" TEXT NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "minimum_wholesale" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_products_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_tier_prices" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "min_qty" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "commerce_tier_prices_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_addresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address_line" TEXT NOT NULL,
    "postal_code" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_addresses_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_cart_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_cart_items_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_wishlist_items" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_wishlist_items_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" DECIMAL(12,2) NOT NULL,
    "minimum_spend" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "maximum_discount" DECIMAL(12,2),
    "max_uses" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_coupons_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_coupon_uses" (
    "id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "checkout_group" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_coupon_uses_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_orders" (
    "id" TEXT NOT NULL,
    "checkout_group" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "address_snapshot" JSONB NOT NULL,
    "payment_method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "coupon_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_orders_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "commerce_order_items_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_wholesale_requests" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "district" TEXT NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_wholesale_requests_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_wholesale_quotes" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "note" TEXT NOT NULL DEFAULT '',
    "expires_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_wholesale_quotes_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_conversations" (
    "id" TEXT NOT NULL,
    "buyer_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_conversations_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_messages" (
    "id" TEXT NOT NULL,
    "conversation_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commerce_messages_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE IF NOT EXISTS "commerce_reviews" (
    "id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "body" TEXT NOT NULL DEFAULT '',
    "reply" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commerce_reviews_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_sellers_user_id_key" ON "commerce_sellers"("user_id");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_sellers_status_created_at_idx" ON "commerce_sellers"("status", "created_at");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_categories_slug_key" ON "commerce_categories"("slug");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_products_status_category_id_created_at_idx" ON "commerce_products"("status", "category_id", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_products_seller_id_status_idx" ON "commerce_products"("seller_id", "status");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_tier_prices_product_id_min_qty_key" ON "commerce_tier_prices"("product_id", "min_qty");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_addresses_user_id_is_default_idx" ON "commerce_addresses"("user_id", "is_default");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_cart_items_user_id_product_id_key" ON "commerce_cart_items"("user_id", "product_id");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_wishlist_items_user_id_product_id_key" ON "commerce_wishlist_items"("user_id", "product_id");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_coupons_code_key" ON "commerce_coupons"("code");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_coupons_is_active_expires_at_idx" ON "commerce_coupons"("is_active", "expires_at");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_coupon_uses_checkout_group_key" ON "commerce_coupon_uses"("checkout_group");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_coupon_uses_coupon_id_user_id_key" ON "commerce_coupon_uses"("coupon_id", "user_id");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_orders_buyer_id_created_at_idx" ON "commerce_orders"("buyer_id", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_orders_seller_id_status_created_at_idx" ON "commerce_orders"("seller_id", "status", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_orders_checkout_group_idx" ON "commerce_orders"("checkout_group");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_order_items_product_id_idx" ON "commerce_order_items"("product_id");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_wholesale_requests_status_created_at_idx" ON "commerce_wholesale_requests"("status", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_wholesale_requests_buyer_id_status_idx" ON "commerce_wholesale_requests"("buyer_id", "status");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_wholesale_quotes_request_id_status_idx" ON "commerce_wholesale_quotes"("request_id", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_wholesale_quotes_request_id_seller_id_key" ON "commerce_wholesale_quotes"("request_id", "seller_id");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_conversations_buyer_id_updated_at_idx" ON "commerce_conversations"("buyer_id", "updated_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_conversations_seller_id_updated_at_idx" ON "commerce_conversations"("seller_id", "updated_at");
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_conversations_buyer_id_seller_id_product_id_key" ON "commerce_conversations"("buyer_id", "seller_id", "product_id");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_messages_conversation_id_created_at_idx" ON "commerce_messages"("conversation_id", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_reviews_product_id_created_at_idx" ON "commerce_reviews"("product_id", "created_at");
-- CreateIndex
CREATE INDEX IF NOT EXISTS "commerce_reviews_seller_id_created_at_idx" ON "commerce_reviews"("seller_id", "created_at");
-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "commerce_reviews_reviewer_id_product_id_order_id_key" ON "commerce_reviews"("reviewer_id", "product_id", "order_id");
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_sellers_user_id_fkey' AND conrelid = '"commerce_sellers"'::regclass) THEN ALTER TABLE "commerce_sellers" ADD CONSTRAINT "commerce_sellers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_products_seller_id_fkey' AND conrelid = '"commerce_products"'::regclass) THEN ALTER TABLE "commerce_products" ADD CONSTRAINT "commerce_products_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "commerce_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_products_category_id_fkey' AND conrelid = '"commerce_products"'::regclass) THEN ALTER TABLE "commerce_products" ADD CONSTRAINT "commerce_products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "commerce_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_tier_prices_product_id_fkey' AND conrelid = '"commerce_tier_prices"'::regclass) THEN ALTER TABLE "commerce_tier_prices" ADD CONSTRAINT "commerce_tier_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_addresses_user_id_fkey' AND conrelid = '"commerce_addresses"'::regclass) THEN ALTER TABLE "commerce_addresses" ADD CONSTRAINT "commerce_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_cart_items_user_id_fkey' AND conrelid = '"commerce_cart_items"'::regclass) THEN ALTER TABLE "commerce_cart_items" ADD CONSTRAINT "commerce_cart_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_cart_items_product_id_fkey' AND conrelid = '"commerce_cart_items"'::regclass) THEN ALTER TABLE "commerce_cart_items" ADD CONSTRAINT "commerce_cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wishlist_items_user_id_fkey' AND conrelid = '"commerce_wishlist_items"'::regclass) THEN ALTER TABLE "commerce_wishlist_items" ADD CONSTRAINT "commerce_wishlist_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wishlist_items_product_id_fkey' AND conrelid = '"commerce_wishlist_items"'::regclass) THEN ALTER TABLE "commerce_wishlist_items" ADD CONSTRAINT "commerce_wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_coupon_uses_coupon_id_fkey' AND conrelid = '"commerce_coupon_uses"'::regclass) THEN ALTER TABLE "commerce_coupon_uses" ADD CONSTRAINT "commerce_coupon_uses_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "commerce_coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_coupon_uses_user_id_fkey' AND conrelid = '"commerce_coupon_uses"'::regclass) THEN ALTER TABLE "commerce_coupon_uses" ADD CONSTRAINT "commerce_coupon_uses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_orders_buyer_id_fkey' AND conrelid = '"commerce_orders"'::regclass) THEN ALTER TABLE "commerce_orders" ADD CONSTRAINT "commerce_orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_orders_seller_id_fkey' AND conrelid = '"commerce_orders"'::regclass) THEN ALTER TABLE "commerce_orders" ADD CONSTRAINT "commerce_orders_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "commerce_sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_order_items_order_id_fkey' AND conrelid = '"commerce_order_items"'::regclass) THEN ALTER TABLE "commerce_order_items" ADD CONSTRAINT "commerce_order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_order_items_product_id_fkey' AND conrelid = '"commerce_order_items"'::regclass) THEN ALTER TABLE "commerce_order_items" ADD CONSTRAINT "commerce_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wholesale_requests_buyer_id_fkey' AND conrelid = '"commerce_wholesale_requests"'::regclass) THEN ALTER TABLE "commerce_wholesale_requests" ADD CONSTRAINT "commerce_wholesale_requests_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wholesale_requests_product_id_fkey' AND conrelid = '"commerce_wholesale_requests"'::regclass) THEN ALTER TABLE "commerce_wholesale_requests" ADD CONSTRAINT "commerce_wholesale_requests_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wholesale_quotes_request_id_fkey' AND conrelid = '"commerce_wholesale_quotes"'::regclass) THEN ALTER TABLE "commerce_wholesale_quotes" ADD CONSTRAINT "commerce_wholesale_quotes_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "commerce_wholesale_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_wholesale_quotes_seller_id_fkey' AND conrelid = '"commerce_wholesale_quotes"'::regclass) THEN ALTER TABLE "commerce_wholesale_quotes" ADD CONSTRAINT "commerce_wholesale_quotes_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "commerce_sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_conversations_buyer_id_fkey' AND conrelid = '"commerce_conversations"'::regclass) THEN ALTER TABLE "commerce_conversations" ADD CONSTRAINT "commerce_conversations_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_conversations_seller_id_fkey' AND conrelid = '"commerce_conversations"'::regclass) THEN ALTER TABLE "commerce_conversations" ADD CONSTRAINT "commerce_conversations_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "commerce_sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_conversations_product_id_fkey' AND conrelid = '"commerce_conversations"'::regclass) THEN ALTER TABLE "commerce_conversations" ADD CONSTRAINT "commerce_conversations_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_messages_conversation_id_fkey' AND conrelid = '"commerce_messages"'::regclass) THEN ALTER TABLE "commerce_messages" ADD CONSTRAINT "commerce_messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "commerce_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_messages_author_id_fkey' AND conrelid = '"commerce_messages"'::regclass) THEN ALTER TABLE "commerce_messages" ADD CONSTRAINT "commerce_messages_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_reviews_reviewer_id_fkey' AND conrelid = '"commerce_reviews"'::regclass) THEN ALTER TABLE "commerce_reviews" ADD CONSTRAINT "commerce_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_reviews_product_id_fkey' AND conrelid = '"commerce_reviews"'::regclass) THEN ALTER TABLE "commerce_reviews" ADD CONSTRAINT "commerce_reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "commerce_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_reviews_seller_id_fkey' AND conrelid = '"commerce_reviews"'::regclass) THEN ALTER TABLE "commerce_reviews" ADD CONSTRAINT "commerce_reviews_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "commerce_sellers"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
-- AddForeignKey
DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'commerce_reviews_order_id_fkey' AND conrelid = '"commerce_reviews"'::regclass) THEN ALTER TABLE "commerce_reviews" ADD CONSTRAINT "commerce_reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "commerce_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE; END IF; END $$;
