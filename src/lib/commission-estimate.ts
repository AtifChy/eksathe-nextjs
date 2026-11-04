const amountPattern = /^\d{0,10}(?:\.\d{1,2})?$/;
const ratePattern = /^\d{1,3}(?:\.\d{1,2})?$/;

function toMinorUnits(value: string): number | null {
  if (!amountPattern.test(value)) return null;
  const [whole = "0", fraction = ""] = value.split(".");
  return Number(whole || "0") * 100 + Number((fraction + "00").slice(0, 2));
}

function toRateBasisPoints(value: string): number | null {
  if (!ratePattern.test(value) || Number(value) > 100) return null;
  const [whole = "0", fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number((fraction + "00").slice(0, 2));
}

export function estimateCommission(amount: string, transport: string, ratePercent: string) {
  const eligibleAmount = toMinorUnits(amount);
  const transportAmount = toMinorUnits(transport);
  const rateBasisPoints = toRateBasisPoints(ratePercent);
  if (eligibleAmount === null || transportAmount === null || rateBasisPoints === null) return null;
  const whole = Math.floor(eligibleAmount / 10000);
  const remainder = eligibleAmount % 10000;
  const commission = whole * rateBasisPoints + Math.floor((remainder * rateBasisPoints + 5000) / 10000);
  return { commissionCents: commission, providerCents: eligibleAmount - commission + transportAmount };
}
