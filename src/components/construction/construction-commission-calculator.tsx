"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/language-provider";
import { estimateCommission } from "@/lib/commission-estimate";

export function ConstructionCommissionCalculator({ ratePercent }: { ratePercent: string | null }) {
  const [amount, setAmount] = useState("100000");
  const [transport, setTransport] = useState("0");
  const { locale } = useLanguage();
  const english = locale === "en";
  const estimate = ratePercent === null ? null : estimateCommission(amount, transport, ratePercent);
  const format = (cents: number) => new Intl.NumberFormat(english ? "en-BD" : "bn-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100);

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{english ? "Estimate a project transaction" : "প্রকল্পের লেনদেনের আনুমানিক হিসাব"}</p><Badge variant="secondary">{english ? "Estimate" : "আনুমানিক"}{estimate ? ` · ${ratePercent}%` : ""}</Badge></div>
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          <Field><FieldLabel htmlFor="construction-eligible-amount">{english ? "Work or material amount (BDT)" : "কাজ বা সামগ্রীর মূল্য (টাকা)"}</FieldLabel><Input id="construction-eligible-amount" type="number" min="0" max="9999999999.99" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></Field>
          <Field><FieldLabel htmlFor="construction-transport-amount">{english ? "Separate transport charge (BDT)" : "আলাদা পরিবহন খরচ (টাকা)"}</FieldLabel><Input id="construction-transport-amount" type="number" min="0" max="9999999999.99" step="0.01" inputMode="decimal" value={transport} onChange={(event) => setTransport(event.target.value)} /></Field>
        </FieldGroup>
        <p className="text-xs leading-5 text-muted-foreground">{english ? "Transport is excluded from the commission calculation. Actual accepted terms determine the final amounts." : "কমিশনের হিসাবে পরিবহন খরচ ধরা হয়নি। চূড়ান্ত অর্থ সম্মত শর্ত অনুযায়ী নির্ধারিত হবে।"}</p>
        {estimate ? <div className="flex flex-col gap-3 border-t pt-4 text-sm"><Result label={english ? "Estimated platform commission" : "প্ল্যাটফর্ম কমিশনের অনুমান"} value={format(estimate.commissionCents)} /><Result label={english ? "Estimated provider amount, including transport" : "পরিবহনসহ সেবাদাতার আনুমানিক প্রাপ্য"} value={format(estimate.providerCents)} /></div> : <p role="status" className="text-sm text-muted-foreground">{english ? "The construction commission rate is not available right now." : "নির্মাণ খাতের কমিশনের হার এখন পাওয়া যাচ্ছে না।"}</p>}
      </CardContent>
    </Card>
  );
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-muted-foreground">{label}</span><strong>{value}</strong></div>;
}
