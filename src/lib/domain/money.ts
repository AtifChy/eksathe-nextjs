import { Prisma } from "@/generated/prisma/client";

export function calculateCommission(amount: Prisma.Decimal, rate: Prisma.Decimal) {
  return amount.mul(rate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

export function calculateCommissionReduction(
  refundAmount: Prisma.Decimal,
  goodsSubtotal: Prisma.Decimal,
  transportFee: Prisma.Decimal,
  rate: Prisma.Decimal,
) {
  const total = goodsSubtotal.plus(transportFee);
  const goodsRefund = total.greaterThan(0) ? refundAmount.mul(goodsSubtotal).div(total) : new Prisma.Decimal(0);
  return calculateCommission(goodsRefund, rate);
}

export function calculateRemainingPayment(
  total: Prisma.Decimal,
  payments: Array<{ amount: Prisma.Decimal; refundAmount: Prisma.Decimal | null }>,
) {
  const recorded = payments.reduce(
    (sum, payment) => sum.plus(payment.amount).minus(payment.refundAmount ?? 0),
    new Prisma.Decimal(0),
  );
  return Prisma.Decimal.max(0, total.minus(recorded));
}
