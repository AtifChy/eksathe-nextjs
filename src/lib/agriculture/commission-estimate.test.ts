import { describe, expect, test } from "bun:test";
import { estimateAgricultureCommission } from "@/lib/agriculture/commission-estimate";

describe("agriculture commission estimates", () => {
  test("uses the configured rate and excludes separate transport from commission", () => {
    expect(estimateAgricultureCommission("1000", "25.50", "10")).toEqual({ commissionCents: 10000, providerCents: 92550 });
  });

  test("rounds to the nearest paisa and rejects invalid money or commission rates", () => {
    expect(estimateAgricultureCommission("0.05", "0", "10")?.commissionCents).toBe(1);
    expect(estimateAgricultureCommission("-1", "0", "10")).toBeNull();
    expect(estimateAgricultureCommission("100", "0", "101")).toBeNull();
  });
});
