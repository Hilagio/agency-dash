-- Featured product image for client-facing dashboards. Additive + idempotent.
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
