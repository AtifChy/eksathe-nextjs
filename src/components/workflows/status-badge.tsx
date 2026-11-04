"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations();
  const key = `statuses.${status}` as never;
  const label = t.has(key) ? t(key) : status.replaceAll("_", " ").toLowerCase();
  return (
    <Badge
      variant={
        status === "REJECTED" || status === "SUSPENDED" || status === "DISPUTED"
          ? "destructive"
          : status === "APPROVED" || status === "COMPLETED" || status === "COLLECTED"
            ? "default"
            : "secondary"
      }
    >
      {label}
    </Badge>
  );
}
