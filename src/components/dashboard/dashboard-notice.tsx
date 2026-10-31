"use client";

import { useLanguage } from "@/components/language-provider";

export function DashboardNotice() {
  const { t } = useLanguage();
  return (
    <p className="mb-6 text-sm text-muted-foreground">{t.dashboard.demoNotice}</p>
  );
}
