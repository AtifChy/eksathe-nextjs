import { z } from "zod";

const requiredText = (limit: number) => z.string().trim().min(1).max(limit);
const moneyText = z
  .string()
  .trim()
  .regex(/^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/)
  .refine((value) => Number(value) > 0);

export const commerceIdSchema = z.string().trim().min(1).max(64);

export const commerceProductSchema = z.object({
  categoryId: commerceIdSchema,
  titleBn: requiredText(160),
  titleEn: requiredText(160),
  descriptionBn: z.string().trim().max(4000),
  descriptionEn: z.string().trim().max(4000),
  unit: requiredText(32),
  price: moneyText,
  stock: z.coerce.number().int().min(0).max(1_000_000),
  minimumWholesale: z.coerce.number().int().min(1).max(1_000_000),
});

export const commerceAddressSchema = z.object({
  fullName: requiredText(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9()\-\s]{7,24}$/)
    .refine(
      (value) => value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15,
    ),
  district: requiredText(80),
  city: requiredText(80),
  addressLine: requiredText(240),
  postalCode: z.string().trim().max(16),
});

export const quantitySchema = z.coerce.number().int().min(1).max(1_000_000);

export const wholesaleRequestSchema = z.object({
  productId: commerceIdSchema,
  quantity: quantitySchema,
  district: requiredText(80),
  note: z.string().trim().max(1000),
});

export const wholesaleQuoteSchema = z.object({
  requestId: commerceIdSchema,
  unitPrice: moneyText,
  note: z.string().trim().max(1000),
});

export const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9_-]{3,32}$/),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: moneyText,
  minimumSpend: z
    .string()
    .trim()
    .regex(/^\d{1,10}(?:\.\d{1,2})?$/),
  maximumDiscount: z
    .string()
    .trim()
    .regex(/^\d{1,10}(?:\.\d{1,2})?$/)
    .or(z.literal(""))
    .refine((value) => value === "" || Number(value) > 0),
  maxUses: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/)
    .or(z.literal(""))
    .refine((value) => value === "" || Number(value) > 0),
  expiresAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal(""))
    .refine((value) => {
      if (!value) return true;
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
    }),
});

export function calculateCouponDiscount(
  subtotal: string,
  type: "PERCENT" | "FIXED",
  value: string,
  maximumDiscount?: string | null,
) {
  const toCents = (amount: string) => {
    const [whole, fraction = ""] = amount.split(".");
    return BigInt(whole) * BigInt(100) + BigInt(fraction.padEnd(2, "0"));
  };
  const subtotalCents = toCents(subtotal);
  const valueCents = toCents(value);
  let discountCents =
    type === "PERCENT" ? (subtotalCents * valueCents) / BigInt(10_000) : valueCents;
  if (maximumDiscount)
    discountCents =
      discountCents < toCents(maximumDiscount) ? discountCents : toCents(maximumDiscount);
  if (discountCents > subtotalCents) discountCents = subtotalCents;
  return `${discountCents / BigInt(100)}.${String(discountCents % BigInt(100)).padStart(2, "0")}`;
}
