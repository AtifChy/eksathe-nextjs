"use client";

import { useState } from "react";

import { useLanguage } from "@/components/language-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { estimateAgricultureCommission } from "@/lib/agriculture/commission-estimate";

export function AgricultureCommissionCalculator({ ratePercent }: { ratePercent: string | null }) {
  const [amount, setAmount] = useState("1000");
  const [transport, setTransport] = useState("0");
  const { locale } = useLanguage();
  const english = locale === "en";
  const estimate =
    ratePercent === null ? null : estimateAgricultureCommission(amount, transport, ratePercent);
  const commissionCents = estimate?.commissionCents ?? null;
  const providerCents = estimate?.providerCents ?? null;
  const format = (cents: number) =>
    new Intl.NumberFormat(english ? "en-BD" : "bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-semibold">{english ? "Estimate the split" : "সম্ভাব্য হিসাব"}</p>
          <Badge variant="secondary">
            {english ? "Estimate" : "আনুমানিক"}
            {estimate ? ` · ${ratePercent}%` : ""}
          </Badge>
        </div>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="agriculture-eligible-amount">
              {english ? "Goods or service amount (BDT)" : "পণ্য বা সেবার মূল্য (টাকা)"}
            </FieldLabel>
            <Input
              id="agriculture-eligible-amount"
              type="number"
              min="0"
              max="9999999999.99"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="agriculture-transport-amount">
              {english ? "Separate transport charge (BDT)" : "আলাদা পরিবহন খরচ (টাকা)"}
            </FieldLabel>
            <Input
              id="agriculture-transport-amount"
              type="number"
              min="0"
              max="9999999999.99"
              step="0.01"
              inputMode="decimal"
              value={transport}
              onChange={(event) => setTransport(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <p className="text-muted-foreground text-xs leading-5">
          {english
            ? "Transport is excluded from the commission calculation. Actual charges and agreed terms may differ."
            : "কমিশনের হিসাবে পরিবহন খরচ ধরা হয়নি। প্রকৃত খরচ ও সম্মত শর্ত ভিন্ন হতে পারে।"}
        </p>
        {commissionCents === null || providerCents === null ? (
          <p role="status" className="text-muted-foreground text-sm">
            {english
              ? "The agriculture commission rate is not available right now."
              : "এখন কৃষি কমিশনের হার পাওয়া যাচ্ছে না।"}
          </p>
        ) : (
          <div className="flex flex-col gap-3 border-t pt-4 text-sm">
            <Result
              label={english ? "Estimated platform commission" : "সম্ভাব্য প্ল্যাটফর্ম কমিশন"}
              value={format(commissionCents)}
            />
            <Result
              label={
                english
                  ? "Estimated provider amount, including transport"
                  : "পরিবহনসহ সেবাদাতার সম্ভাব্য প্রাপ্য"
              }
              value={format(providerCents)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
