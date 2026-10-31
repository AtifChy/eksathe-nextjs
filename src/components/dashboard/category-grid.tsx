"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SearchIcon } from "lucide-react";

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
      const haystack = `${cat.labelEn} ${cat.labelBn} ${cat.slug}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [categories, query]);

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.dashboard.searchPlaceholder}
          className="h-10 pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.dashboard.noResults}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map((cat) => {
            const label = locale === "bn" ? cat.labelBn : cat.labelEn;
            return (
              <Link
                key={cat.id}
                href={`/dashboard/${cat.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md active:translate-y-0"
              >
                <span
                  className="flex size-16 items-center justify-center rounded-2xl bg-secondary text-3xl transition-transform duration-150 group-hover:scale-105"
                  aria-hidden
                >
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold leading-snug">{label}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{cat.id}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
