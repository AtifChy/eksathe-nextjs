"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function formatMoney(value: number) {
  return `৳${value.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function CommissionCalculator() {
  const [gross, setGross] = useState("1000");

  const amount = Math.max(0, Number(gross) || 0);
  const commission = amount * 0.1;
  const provider = amount * 0.9;

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <Label htmlFor="grossAmount">লেনদেনের মোট পরিমাণ (৳)</Label>
      <Input
        id="grossAmount"
        type="number"
        min={0}
        step="0.01"
        value={gross}
        onChange={(event) => setGross(event.target.value)}
        className="mt-2 h-11 text-lg"
      />

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">প্ল্যাটফর্ম কমিশন (১০%)</span>
          <strong className="text-base">{formatMoney(commission)}</strong>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">সেবাদাতার অংশ (৯০%)</span>
          <strong className="text-base">{formatMoney(provider)}</strong>
        </div>
      </div>
    </div>
  );
}
