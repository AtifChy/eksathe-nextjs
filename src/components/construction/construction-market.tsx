"use client";

import { cn } from "cn";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ConstructionMarketFilters, ConstructionMarketResult } from "@/lib/listings";

export function ConstructionMarket({
  routeBase,
  filters,
  result,
}: {
  routeBase: string;
  filters: ConstructionMarketFilters;
  result: ConstructionMarketResult;
}) {
  const { locale, t } = useLanguage();
  const bn = locale === "bn";
  const formAction = `${routeBase}/market`;
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (filters.q) params.set("q", filters.q);
    if (filters.kind) params.set("type", filters.kind);
    if (filters.category) params.set("category", filters.category);
    if (filters.district) params.set("district", filters.district);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sort) params.set("sort", filters.sort);
    if (page > 1) params.set("page", String(page));
    return `${formAction}${params.size ? `?${params.toString()}` : ""}`;
  };
  const formatMoney = (value: string) =>
    new Intl.NumberFormat(bn ? "bn-BD" : "en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(Number(value));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-col gap-3">
        <Link
          href={routeBase}
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          {bn ? "নির্মাণ সেবায় ফিরুন" : "Back to construction services"}
        </Link>
        <div>
          <p className="text-primary text-sm font-semibold">
            {bn ? "অনুমোদিত পেশাজীবী ও সরবরাহকারী" : "Approved professionals and suppliers"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {bn ? "নির্মাণ সেবা ও সামগ্রী খুঁজুন" : "Find construction services and materials"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            {bn
              ? "কাজের ধরন, অবস্থান ও মূল্য অনুযায়ী তালিকা দেখুন। প্রকল্প তৈরি করে একাধিক সেবাদাতার দরপ্রস্তাবও তুলনা করতে পারেন।"
              : "Browse by work type, location, and price. Create a project when you want to compare quotes from several providers."}
          </p>
        </div>
      </div>

      <form
        method="get"
        action={formAction}
        className="border-border/70 bg-card rounded-2xl border p-4 sm:p-5"
      >
        <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field className="lg:col-span-2">
            <FieldLabel htmlFor="construction-search">
              {bn ? "সেবা, সামগ্রী বা সেবাদাতা খুঁজুন" : "Search services, materials, or providers"}
            </FieldLabel>
            <div className="relative">
              <SearchIcon
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input
                id="construction-search"
                name="q"
                defaultValue={filters.q}
                placeholder={bn ? "যেমন: ইট, প্রকৌশলী, ঢাকা" : "e.g. bricks, engineer, Dhaka"}
                className="pl-9"
              />
            </div>
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-type">{bn ? "ধরন" : "Type"}</FieldLabel>
            <select
              id="construction-type"
              name="type"
              defaultValue={filters.kind ?? ""}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              <option value="">{bn ? "সব নির্মাণ তালিকা" : "All construction listings"}</option>
              <option value="CONSTRUCTION_SERVICE">
                {bn ? "পেশাজীবী ও সেবা" : "Professionals & services"}
              </option>
              <option value="CONSTRUCTION_MATERIAL">
                {bn ? "নির্মাণসামগ্রী" : "Building materials"}
              </option>
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-category">{bn ? "ক্যাটাগরি" : "Category"}</FieldLabel>
            <select
              id="construction-category"
              name="category"
              defaultValue={filters.category ?? ""}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              <option value="">{bn ? "সব ক্যাটাগরি" : "All categories"}</option>
              {result.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-district">{bn ? "জেলা" : "District"}</FieldLabel>
            <select
              id="construction-district"
              name="district"
              defaultValue={filters.district ?? ""}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              <option value="">{bn ? "সব জেলা" : "All districts"}</option>
              {result.districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-min-price">
              {bn ? "সর্বনিম্ন মূল্য" : "Minimum price"}
            </FieldLabel>
            <Input
              id="construction-min-price"
              name="minPrice"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={filters.minPrice}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-max-price">
              {bn ? "সর্বোচ্চ মূল্য" : "Maximum price"}
            </FieldLabel>
            <Input
              id="construction-max-price"
              name="maxPrice"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={filters.maxPrice}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="construction-sort">{bn ? "সাজান" : "Sort by"}</FieldLabel>
            <select
              id="construction-sort"
              name="sort"
              defaultValue={filters.sort ?? "newest"}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              <option value="newest">{bn ? "সর্বশেষ" : "Newest"}</option>
              <option value="price-asc">{bn ? "মূল্য: কম থেকে বেশি" : "Price: low to high"}</option>
              <option value="price-desc">{bn ? "মূল্য: বেশি থেকে কম" : "Price: high to low"}</option>
            </select>
          </Field>
        </FieldGroup>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button type="submit">
            <SearchIcon data-icon="inline-start" />
            {bn ? "খুঁজুন" : "Search"}
          </Button>
          <Link href={formAction} className={buttonVariants({ variant: "outline" })}>
            {bn ? "ফিল্টার মুছুন" : "Clear filters"}
          </Link>
        </div>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground text-sm" aria-live="polite">
          {result.unavailable
            ? bn
              ? "তালিকা এখন পাওয়া যাচ্ছে না"
              : "Listings are temporarily unavailable"
            : `${result.total.toLocaleString(bn ? "bn-BD" : "en-BD")} ${bn ? "টি তালিকা" : "listings"}`}
        </p>
        <Link
          href="/account/projects/new?service=contractors"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          {bn ? "প্রকল্প তৈরি করে দরপ্রস্তাব নিন" : "Create a project to request quotes"}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>

      {result.unavailable ? (
        <p
          role="alert"
          className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-5 text-sm"
        >
          {t.workflow.dataUnavailable}
        </p>
      ) : result.items.length === 0 ? (
        <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
          {bn
            ? "এই ফিল্টারে কোনো অনুমোদিত তালিকা নেই। ফিল্টার বদলে আবার চেষ্টা করুন।"
            : "No approved listings match these filters. Adjust your search and try again."}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((listing) => (
            <Card key={listing.id} className="h-full overflow-hidden">
              <ListingImage
                listing={listing}
                alt={bn ? listing.titleBn : listing.titleEn}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <CardHeader>
                <CardTitle>{bn ? listing.titleBn : listing.titleEn}</CardTitle>
                <CardDescription>
                  {bn ? listing.providerNameBn : listing.providerNameEn} · {listing.district} ·{" "}
                  {listing.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {bn ? listing.descriptionBn : listing.descriptionEn}
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-primary font-semibold">
                    {formatMoney(listing.unitPrice)} / {listing.unit}
                  </span>
                  {listing.averageRating !== null && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />
                      {listing.averageRating.toFixed(1)} ({listing.reviewCount})
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    href={`${routeBase}/listings/${listing.id}`}
                  >
                    {bn ? "বিস্তারিত" : "Details"}
                  </Link>
                  <Link
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                    href={`${routeBase}/providers/${listing.providerId}`}
                  >
                    {bn ? "সেবাদাতা" : "Provider"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!result.unavailable && result.totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-3"
          aria-label={bn ? "পৃষ্ঠা নেভিগেশন" : "Pagination"}
        >
          <Link
            href={pageHref(Math.max(1, result.page - 1))}
            aria-disabled={result.page <= 1}
            tabIndex={result.page <= 1 ? -1 : undefined}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              result.page <= 1 && "pointer-events-none opacity-50",
            )}
          >
            <ArrowLeftIcon data-icon="inline-start" />
            {bn ? "আগের" : "Previous"}
          </Link>
          <span className="text-muted-foreground text-sm">
            {bn
              ? `পৃষ্ঠা ${result.page} / ${result.totalPages}`
              : `Page ${result.page} of ${result.totalPages}`}
          </span>
          <Link
            href={pageHref(Math.min(result.totalPages, result.page + 1))}
            aria-disabled={result.page >= result.totalPages}
            tabIndex={result.page >= result.totalPages ? -1 : undefined}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              result.page >= result.totalPages && "pointer-events-none opacity-50",
            )}
          >
            <span>{bn ? "পরের" : "Next"}</span>
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </nav>
      )}
    </main>
  );
}
