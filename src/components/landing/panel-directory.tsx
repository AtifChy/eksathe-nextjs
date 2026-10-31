"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

import { useLanguage } from "@/components/language-provider";
import { RequestForm } from "@/components/landing/request-form";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { ActivePanel } from "@/lib/panels";

const categoryMap: Record<string, { en: string; bn: string }> = {
  "কৃষি": { en: "Agriculture", bn: "কৃষি" },
  "শ্রম": { en: "Labor", bn: "শ্রম" },
  "বাজার": { en: "Market", bn: "বাজার" },
  "অর্থায়ন": { en: "Finance", bn: "অর্থায়ন" },
  "তথ্য": { en: "Information", bn: "তথ্য" },
  "কমিউনিটি": { en: "Community", bn: "কমিউনিটি" },
};

function formatCategory(category: string, locale: "en" | "bn") {
  return categoryMap[category]?.[locale] ?? category;
}

export function PanelDirectory({ panels }: { panels: ActivePanel[] }) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<ActivePanel | null>(null);
  const [open, setOpen] = useState(false);

  const rawCategories = useMemo(
    () => Array.from(new Set(panels.map((panel) => panel.category))),
    [panels],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();

    return panels.filter((panel) => {
      const localizedCategory = formatCategory(panel.category, locale).toLowerCase();
      const haystack =
        `${panel.titleBn} ${panel.titleEn} ${panel.descriptionBn} ${panel.descriptionEn} ${panel.category} ${localizedCategory}`.toLowerCase();
      const matchesTerm = !term || haystack.includes(term);
      const matchesCategory = !category || panel.category === category;

      return matchesTerm && matchesCategory;
    });
  }, [panels, query, category, locale]);

  function openPanel(panel: ActivePanel) {
    setSelected(panel);
    setOpen(true);
  }

  return (
    <section id="panels" className="mx-auto w-full max-w-7xl px-4 py-14">
      <div className="mb-6">
        <p className="text-sm font-bold tracking-wide text-primary">
          {t.panels.sectionTag}
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight">
          {t.panels.sectionTitle}
        </h2>
        <p className="mt-1 text-muted-foreground">
          {t.panels.sectionSubtitle}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.panels.searchPlaceholder}
            aria-label={t.panels.searchAriaLabel}
            className="h-10 pl-8"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label={t.panels.categoryAriaLabel}
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-52 dark:bg-input/30"
        >
          <option value="">{t.panels.allCategories}</option>
          {rawCategories.map((rawCat) => (
            <option key={rawCat} value={rawCat}>
              {formatCategory(rawCat, locale)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          {t.panels.noPanelsFound}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((panel) => {
            const title = locale === "en" ? panel.titleEn : panel.titleBn;
            const description =
              locale === "en" ? panel.descriptionEn : panel.descriptionBn;
            const categoryLabel = formatCategory(panel.category, locale);

            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => openPanel(panel)}
                className="group flex h-full flex-col rounded-2xl border bg-card p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span
                  className="mb-3 flex size-12 items-center justify-center rounded-xl bg-secondary text-2xl"
                  aria-hidden
                >
                  {panel.icon}
                </span>
                <Badge variant="secondary" className="mb-2">
                  {categoryLabel}
                </Badge>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {description}
                </p>
                <span className="mt-auto pt-4 text-sm font-semibold text-primary">
                  {t.panels.viewDetailsAndRequest}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected ? (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 pr-8">
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl"
                    aria-hidden
                  >
                    {selected.icon}
                  </span>
                  <div>
                    <DialogTitle className="text-xl">
                      {locale === "en" ? selected.titleEn : selected.titleBn}
                    </DialogTitle>
                    <DialogDescription>
                      {locale === "en" ? selected.titleBn : selected.titleEn} •{" "}
                      {formatCategory(selected.category, locale)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                {locale === "en"
                  ? selected.descriptionEn
                  : selected.descriptionBn}
              </p>

              <Separator />

              <div>
                <h3 className="text-base font-semibold">
                  {t.panels.submitRequestTitle}
                </h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  {t.panels.paymentNotice}
                </p>
                <RequestForm key={selected.id} panelId={selected.id} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
