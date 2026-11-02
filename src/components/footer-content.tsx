"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { BrandLogo } from "@/components/brand-logo";

export function FooterContent({ year }: { year: number }) {
  const { t } = useLanguage();
  const pathname = usePathname();

  if (pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="border-t bg-card py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-3">
          <BrandLogo className="size-20" />
          <span>© {year} {t.common.brandName}</span>
        </div>
        <span>{t.footer.tagline}</span>
      </div>
    </footer>
  );
}
