"use client";

import { useLanguage } from "@/components/language-provider";

export function FooterContent({ year }: { year: number }) {
  const { t } = useLanguage();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
      <span>
        © {year} {t.common.brandName}
      </span>
      <span>{t.footer.tagline}</span>
    </div>
  );
}
