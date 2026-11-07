import { describe, expect, it } from "bun:test";

import {
  calculateCouponDiscount,
  commerceAddressSchema,
  commerceProductSchema,
  couponSchema,
  wholesaleRequestSchema,
} from "@/lib/commerce-validation";

describe("native commerce validation", () => {
  it("accepts valid product and address inputs while rejecting invalid stock and phone values", () => {
    expect(
      commerceProductSchema.safeParse({
        categoryId: "cat-1",
        titleBn: "চাল",
        titleEn: "Rice",
        descriptionBn: "",
        descriptionEn: "",
        unit: "kg",
        price: "82.50",
        stock: "12",
        minimumWholesale: "5",
      }).success,
    ).toBe(true);
    expect(
      commerceProductSchema.safeParse({
        categoryId: "cat-1",
        titleBn: "Rice",
        titleEn: "Rice",
        descriptionBn: "",
        descriptionEn: "",
        unit: "kg",
        price: "-1",
        stock: "-4",
        minimumWholesale: "1",
      }).success,
    ).toBe(false);
    expect(
      commerceAddressSchema.safeParse({
        fullName: "Buyer",
        phone: "not-a-phone",
        district: "Dhaka",
        city: "Dhaka",
        addressLine: "Road 1",
        postalCode: "",
      }).success,
    ).toBe(false);
  });

  it("requires a wholesale request quantity and location", () => {
    expect(
      wholesaleRequestSchema.safeParse({
        productId: "product-1",
        quantity: 0,
        district: "",
        note: "",
      }).success,
    ).toBe(false);
  });

  it("calculates fixed and percentage discounts in exact paisa and caps them", () => {
    expect(calculateCouponDiscount("100.01", "PERCENT", "12.5")).toBe("12.50");
    expect(calculateCouponDiscount("30.00", "FIXED", "45.00")).toBe("30.00");
    expect(calculateCouponDiscount("500.00", "PERCENT", "50", "90.00")).toBe("90.00");
  });

  it("rejects malformed or impossible coupon expiry dates and zero-use coupons", () => {
    const coupon = {
      code: "SAVE10",
      discountType: "PERCENT",
      discountValue: "10",
      minimumSpend: "0",
      maximumDiscount: "",
      maxUses: "0",
      expiresAt: "2026-02-31",
    };
    expect(couponSchema.safeParse(coupon).success).toBe(false);
    expect(couponSchema.safeParse({ ...coupon, maxUses: "", expiresAt: "" }).success).toBe(true);
  });
});
