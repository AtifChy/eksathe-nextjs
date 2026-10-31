"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";

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

export function PanelDirectory({ panels }: { panels: ActivePanel[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState<ActivePanel | null>(null);
  const [open, setOpen] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(panels.map((panel) => panel.category))),
    [panels],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("bn");

    return panels.filter((panel) => {
      const haystack =
        `${panel.titleBn} ${panel.titleEn} ${panel.category}`.toLocaleLowerCase(
          "bn",
        );
      const matchesTerm = !term || haystack.includes(term);
      const matchesCategory = !category || panel.category === category;

      return matchesTerm && matchesCategory;
    });
  }, [panels, query, category]);

  function openPanel(panel: ActivePanel) {
    setSelected(panel);
    setOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="সেবা খুঁজুন..."
            aria-label="সেবা খুঁজুন"
            className="h-10 pl-8"
          />
        </div>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="ক্যাটাগরি ফিল্টার"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-52 dark:bg-input/30"
        >
          <option value="">সব ক্যাটাগরি</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
          কোনো সেবা পাওয়া যায়নি। অন্য শব্দ দিয়ে খুঁজুন।
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((panel) => (
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
                {panel.category}
              </Badge>
              <h3 className="text-base font-semibold">{panel.titleBn}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {panel.descriptionBn}
              </p>
              <span className="mt-auto pt-4 text-sm font-semibold text-primary">
                বিস্তারিত ও অনুরোধ →
              </span>
            </button>
          ))}
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
                      {selected.titleBn}
                    </DialogTitle>
                    <DialogDescription>
                      {selected.titleEn} • {selected.category}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <p className="text-sm text-muted-foreground">
                {selected.descriptionBn}
              </p>

              <Separator />

              <div>
                <h3 className="text-base font-semibold">সেবা অনুরোধ জমা দিন</h3>
                <p className="mb-4 text-xs text-muted-foreground">
                  অনুরোধ জমা দিলেই কোনো পেমেন্ট সম্পন্ন হয় না।
                </p>
                <RequestForm key={selected.id} panelId={selected.id} />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
