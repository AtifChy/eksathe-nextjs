"use client";

import { cn } from "cn";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setLocaleAction } from "@/app/actions/locale";

interface LanguageToggleProps {
  /** "header" = white text on dark bg (landing header)
   *  "muted"  = normal text on card bg (dashboard header) */
  variant?: "header" | "muted";
}

export function LanguageToggle({ variant = "header" }: LanguageToggleProps) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [failed, setFailed] = useState(false);
  const isHeader = variant === "header";

  function selectLocale(value: "en" | "bn") {
    if (pending || value === locale) return;
    setFailed(false);
    startTransition(async () => {
      try {
        const result = await setLocaleAction(value);
        if (!result.ok) {
          setFailed(true);
          return;
        }
        router.refresh();
      } catch {
        setFailed(true);
      }
    });
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div
        role="group"
        aria-label={t("header.switchLanguage")}
        aria-busy={pending}
        className={cn(
          "inline-flex h-8 items-center rounded-lg border p-0.5 text-xs font-medium",
          isHeader
            ? "border-white/20 bg-white/5 text-white/80"
            : "border-input bg-muted/50 text-foreground",
        )}
      >
        <button
          type="button"
          onClick={() => selectLocale("en")}
          aria-pressed={locale === "en"}
          disabled={pending}
          className={cn(
            "rounded-md px-2 py-1 transition-all disabled:opacity-60",
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
          onClick={() => selectLocale("bn")}
          aria-pressed={locale === "bn"}
          disabled={pending}
          className={cn(
            "rounded-md px-2 py-1 transition-all disabled:opacity-60",
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
      {failed && (
        <span role="alert" className={cn("text-xs", isHeader ? "text-white" : "text-destructive")}>
          {t("locale.changeFailed")}
        </span>
      )}
    </div>
  );
}
