"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon, XIcon } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { Input } from "@/components/ui/input";

export function CategoryGrid() {
  const { locale, t } = useLanguage();
  const categories = t.dashboard.categories;
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((cat) => {
      const haystack = `${cat.labelEn} ${cat.labelBn} ${cat.slug} ${cat.id}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [categories, query]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Filter (subtle, aligned right/left) */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.search}
            className="h-9 pl-9 pr-8 text-xs bg-card/60 backdrop-blur-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
            {filtered.length} {locale === "bn" ? "টি বিভাগ" : "sectors"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{t.nav.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((cat) => {
            const label = locale === "bn" ? cat.labelBn : cat.labelEn;
            return (
              <Link
                key={cat.id}
                href={cat.slug === "agriculture-labor" ? "/dashboard/agriculture" : `/dashboard/${cat.slug}`}
                className="group relative flex flex-col items-center justify-between rounded-2xl border border-border/70 bg-card p-5 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md active:translate-y-0"
              >
                <div className="flex flex-1 flex-col items-center justify-center pt-1 pb-3">
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    <span className="text-4xl leading-none" aria-hidden="true">{cat.icon}</span>
                  </div>
                  <h3 className="mt-3 text-sm font-semibold leading-tight text-foreground">
                    {label}
                  </h3>
                </div>
                <span className="text-xs tabular-nums text-muted-foreground/70 font-medium">
                  {cat.id}
                </span>
                <span className="mt-2 rounded-full bg-muted px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground">
                  {cat.status === "live" ? t.nav.live : t.home.comingSoon}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
