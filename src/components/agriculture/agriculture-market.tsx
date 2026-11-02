"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, StarIcon } from "lucide-react";
import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AgricultureMarketFilters, AgricultureMarketResult } from "@/lib/listings";
import type { AgricultureProductCategory } from "@/lib/listings";
import { cn } from "cn";

const categoryOptions: Array<{ value: AgricultureProductCategory; en: string; bn: string }> = [
  { value: "grains", en: "Grains", bn: "শস্য" },
  { value: "vegetables", en: "Vegetables", bn: "সবজি" },
  { value: "fruits", en: "Fruits", bn: "ফল" },
  { value: "dairy", en: "Dairy", bn: "দুগ্ধজাত" },
  { value: "fish", en: "Fish", bn: "মাছ" },
  { value: "spices", en: "Spices", bn: "মসলা" },
  { value: "other", en: "Other", bn: "অন্যান্য" },
];

export function AgricultureMarket({ routeBase, filters, result }: { routeBase: string; filters: AgricultureMarketFilters; result: AgricultureMarketResult }) {
  const { locale, t } = useLanguage();
  const bn = locale === "bn";
  const formatMoney = (amount: string) => new Intl.NumberFormat(bn ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(amount));
  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const key of ["q", "category", "district", "minPrice", "maxPrice", "sort"] as const) {
      const value = filters[key];
      if (value) params.set(key, String(value));
    }
    params.set("page", String(page));
    return `${routeBase}/market?${params.toString()}`;
  }

  return (
    <main className="mx-auto flex w-full max-w-[1440px] flex-col gap-7 px-4 py-8 sm:px-6">
      <Link href={routeBase} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{bn ? "কৃষি সেবায় ফিরুন" : "Back to agriculture"}</Link>
      <header><p className="text-sm font-semibold text-primary">{bn ? "কৃষি মার্কেটপ্লেস" : "Agriculture marketplace"}</p><h1 className="mt-1 text-3xl font-bold tracking-tight">{bn ? "কৃষিপণ্য খুঁজুন" : "Find farm products"}</h1><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{bn ? "বিক্রেতা, বিভাগ, জেলা ও দামের ভিত্তিতে তালিকা খুঁজুন। অনুরোধ পাঠানোর আগে সরবরাহকারীর সঙ্গে শর্ত মিলিয়ে নিন।" : "Search listings by seller, category, district, and price. Confirm terms with the provider before accepting an offer."}</p></header>
      <form action={`${routeBase}/market`} method="get" className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-2 lg:grid-cols-7">
        <div className="relative lg:col-span-2"><SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" name="q" defaultValue={filters.q} placeholder={bn ? "পণ্য বা বিক্রেতা খুঁজুন" : "Search products or sellers"} /></div>
        <select name="category" defaultValue={filters.category ?? ""} aria-label={bn ? "বিভাগ" : "Category"} className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="">{bn ? "সব বিভাগ" : "All categories"}</option>{categoryOptions.map((item) => <option key={item.value} value={item.value}>{bn ? item.bn : item.en}</option>)}</select>
        <select name="district" defaultValue={filters.district ?? ""} aria-label={bn ? "জেলা" : "District"} className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="">{t.workflow.allDistricts}</option>{result.districts.map((district) => <option key={district} value={district}>{district}</option>)}</select>
        <Input name="minPrice" type="number" min="0" step="0.01" defaultValue={filters.minPrice} aria-label={bn ? "সর্বনিম্ন দাম" : "Minimum price"} placeholder={bn ? "সর্বনিম্ন ৳" : "Min BDT"} />
        <Input name="maxPrice" type="number" min="0" step="0.01" defaultValue={filters.maxPrice} aria-label={bn ? "সর্বোচ্চ দাম" : "Maximum price"} placeholder={bn ? "সর্বোচ্চ ৳" : "Max BDT"} />
        <select name="sort" defaultValue={filters.sort ?? "newest"} aria-label={bn ? "সাজান" : "Sort"} className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="newest">{bn ? "নতুন আগে" : "Newest"}</option><option value="price-asc">{bn ? "দাম: কম থেকে বেশি" : "Price: low to high"}</option><option value="price-desc">{bn ? "দাম: বেশি থেকে কম" : "Price: high to low"}</option></select>
        <input type="hidden" name="page" value="1" />
        <Button type="submit" className="lg:col-span-7"><SearchIcon data-icon="inline-start" />{bn ? "খুঁজুন" : "Search"}</Button>
      </form>
      {result.unavailable ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{t.workflow.dataUnavailable}</p> : (
        <>
          <p className="text-sm text-muted-foreground">{result.total.toLocaleString(bn ? "bn-BD" : "en-BD")} {bn ? "টি তালিকা" : "listings"}</p>
          {result.items.length === 0 ? <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{bn ? "এই খোঁজে কোনো প্রকাশিত পণ্য নেই। ফিল্টার বদলে আবার চেষ্টা করুন।" : "No published products match these filters. Adjust your search and try again."}</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.items.map((listing) => <Card key={listing.id} className="h-full overflow-hidden"><ListingImage listing={listing} alt={bn ? listing.titleBn : listing.titleEn} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><CardHeader><CardTitle>{bn ? listing.titleBn : listing.titleEn}</CardTitle><CardDescription>{bn ? listing.providerNameBn : listing.providerNameEn} · {listing.district} · {listing.category}</CardDescription></CardHeader><CardContent><p className="line-clamp-2 text-sm text-muted-foreground">{bn ? listing.descriptionBn : listing.descriptionEn}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="font-semibold text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</span>{listing.averageRating !== null && <span className="inline-flex items-center gap-1 text-sm"><StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />{listing.averageRating.toFixed(1)} ({listing.reviewCount})</span>}</div><div className="mt-4 flex flex-wrap gap-2"><Link className={cn(buttonVariants({ variant: "outline", size: "sm" }))} href={`${routeBase}/listings/${listing.id}`}>{bn ? "বিস্তারিত" : "Details"}</Link><Link className={cn(buttonVariants({ variant: "ghost", size: "sm" }))} href={`${routeBase}/providers/${listing.providerId}`}>{bn ? "বিক্রেতা" : "Seller"}</Link></div></CardContent></Card>)}</div>}
          {result.totalPages > 1 && <nav aria-label={bn ? "পৃষ্ঠা নেভিগেশন" : "Pagination"} className="flex flex-wrap items-center justify-center gap-3"><Link aria-disabled={result.page <= 1} className={cn(buttonVariants({ variant: "outline", size: "sm" }), result.page <= 1 && "pointer-events-none opacity-50")} href={pageHref(Math.max(1, result.page - 1))}><ArrowLeftIcon data-icon="inline-start" />{bn ? "আগের" : "Previous"}</Link><span className="text-sm text-muted-foreground">{bn ? "পৃষ্ঠা" : "Page"} {result.page.toLocaleString(bn ? "bn-BD" : "en-BD")} / {result.totalPages.toLocaleString(bn ? "bn-BD" : "en-BD")}</span><Link aria-disabled={result.page >= result.totalPages} className={cn(buttonVariants({ variant: "outline", size: "sm" }), result.page >= result.totalPages && "pointer-events-none opacity-50")} href={pageHref(Math.min(result.totalPages, result.page + 1))}>{bn ? "পরের" : "Next"}<ArrowRightIcon data-icon="inline-end" /></Link></nav>}
        </>
      )}
    </main>
  );
}
