"use client";

import { CategoryGrid } from "@/components/dashboard/category-grid";
import { useLanguage } from "@/components/language-provider";

export function DashboardHub() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
          {t.home.hubTitle}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">{t.home.hubDescription}</p>
      </div>
      <CategoryGrid />
    </div>
  );
}
