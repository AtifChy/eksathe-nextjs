"use client";

import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language-provider";

const labels: Record<string, { en: string; bn: string }> = {
  PENDING: { en: "Pending review", bn: "পর্যালোচনাধীন" },
  APPROVED: { en: "Approved", bn: "অনুমোদিত" },
  REJECTED: { en: "Declined", bn: "প্রত্যাখ্যাত" },
  SUSPENDED: { en: "Suspended", bn: "স্থগিত" },
  OPEN: { en: "New request", bn: "নতুন অনুরোধ" },
  NEW: { en: "New", bn: "নতুন" },
  REVIEWING: { en: "Under review", bn: "পর্যালোচনাধীন" },
  ASSIGNED: { en: "Assigned", bn: "দায়িত্ব দেওয়া হয়েছে" },
  QUOTED: { en: "Quote sent", bn: "দরপ্রস্তাব পাঠানো" },
  ACCEPTED: { en: "Accepted", bn: "গৃহীত" },
  CANCELLED: { en: "Cancelled", bn: "বাতিল" },
  CONFIRMED: { en: "Confirmed", bn: "নিশ্চিত" },
  IN_PROGRESS: { en: "In progress", bn: "চলমান" },
  AWAITING_CONFIRMATION: { en: "Needs your review", bn: "আপনার নিশ্চিতকরণের অপেক্ষায়" },
  COMPLETED: { en: "Completed", bn: "সম্পন্ন" },
  DISPUTED: { en: "Under review", bn: "বিরোধ নিষ্পত্তির অপেক্ষায়" },
  DUE: { en: "Commission due", bn: "কমিশন বাকি" },
  COLLECTED: { en: "Collected", bn: "আদায় হয়েছে" },
  WAIVED: { en: "Waived", bn: "মওকুফ" },
  REVIEW: { en: "Waiting for approval", bn: "অনুমোদনের অপেক্ষায়" },
  PLANNING: { en: "Planning", bn: "পরিকল্পনায়" },
  ACTIVE: { en: "Active", bn: "চলমান" },
};

export function StatusBadge({ status }: { status: string }) {
  const { locale } = useLanguage();
  const label = labels[status]?.[locale] ?? status.replaceAll("_", " ").toLowerCase();
  return <Badge variant={status === "REJECTED" || status === "SUSPENDED" || status === "DISPUTED" ? "destructive" : status === "APPROVED" || status === "COMPLETED" || status === "COLLECTED" ? "default" : "secondary"}>{label}</Badge>;
}
