import { describe, expect, it } from "bun:test";
import { Prisma } from "@/generated/prisma/client";
import { calculateCommission, calculateCommissionReduction, calculateRemainingPayment } from "@/lib/domain/money";

const decimal = (value: string) => new Prisma.Decimal(value);

describe("marketplace money rules", () => {
  it("rounds BDT commission to two decimal places using half-up rounding", () => {
    expect(calculateCommission(decimal("5.05"), decimal("10")).toString()).toBe("0.51");
    expect(calculateCommission(decimal("0.05"), decimal("10")).toString()).toBe("0.01");
  });

  it("does not calculate commission on the separately stated transport fee", () => {
    expect(calculateCommission(decimal("100"), decimal("10")).toFixed(2)).toBe("10.00");
  });

  it("reduces commission proportionally when a refund includes transport", () => {
    expect(calculateCommissionReduction(decimal("55"), decimal("100"), decimal("10"), decimal("10")).toFixed(2)).toBe("5.00");
  });

  it("subtracts refunds from recorded payment totals", () => {
    const remaining = calculateRemainingPayment(decimal("110"), [
      { amount: decimal("80"), refundAmount: decimal("10") },
      { amount: decimal("20"), refundAmount: null },
    ]);
    expect(remaining.toString()).toBe("20");
  });

  it("never reports a negative remaining balance", () => {
    const remaining = calculateRemainingPayment(decimal("10"), [{ amount: decimal("12"), refundAmount: null }]);
    expect(remaining.toString()).toBe("0");
  });
});
