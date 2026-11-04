"use client";

import { useLanguage } from "@/components/language-provider";

export function DashboardNotice() {
  const { t } = useLanguage();
  return <p className="text-muted-foreground mb-6 text-sm">{t.dashboard.demoNotice}</p>;
}
