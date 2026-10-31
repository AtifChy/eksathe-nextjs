"use client";

import { useLanguage } from "@/components/language-provider";
import { cn } from "cn";

interface LanguageToggleProps {
  /** "header" = white text on dark bg (landing header)
   *  "muted"  = normal text on card bg (dashboard header) */
  variant?: "header" | "muted";
}

export function LanguageToggle({ variant = "header" }: LanguageToggleProps) {
  const { locale, setLocale, t } = useLanguage();

  const isHeader = variant === "header";

  return (
    <div
      role="group"
      aria-label={t.header.switchLanguage}
      className={cn(
        "inline-flex h-8 items-center rounded-lg border p-0.5 text-xs font-medium",
        isHeader
          ? "border-white/20 bg-white/5 text-white/80"
          : "border-input bg-muted/50 text-foreground",
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-md px-2 py-1 transition-all",
          locale === "en"
            ? isHeader
              ? "bg-white font-bold text-[#0b5036] shadow-xs"
              : "bg-background font-bold text-primary shadow-xs"
            : isHeader
              ? "text-white/80 hover:bg-white/10 hover:text-white"
              : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        aria-pressed={locale === "bn"}
        className={cn(
          "rounded-md px-2 py-1 transition-all",
          locale === "bn"
            ? isHeader
              ? "bg-white font-bold text-[#0b5036] shadow-xs"
              : "bg-background font-bold text-primary shadow-xs"
            : isHeader
              ? "text-white/80 hover:bg-white/10 hover:text-white"
              : "text-muted-foreground hover:bg-background hover:text-foreground",
        )}
      >
        বাং
      </button>
    </div>
  );
}
