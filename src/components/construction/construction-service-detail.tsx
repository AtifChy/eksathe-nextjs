"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon, StarIcon } from "lucide-react";
import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConstructionService } from "@/lib/construction/service-registry";
import type { ConstructionMarketResult } from "@/lib/listings";
import { cn } from "cn";

export function ConstructionServiceDetail({ service, routeBase, result }: { service: ConstructionService; routeBase: string; result: ConstructionMarketResult }) {
  const { locale, t } = useLanguage();
  const bn = locale === "bn";
  const projectHref = `/account/projects/new?service=${encodeURIComponent(service.slug)}`;
  const marketParams = new URLSearchParams({ type: service.kind, q: service.searchTerms[0] ?? service.slug });
  const formatMoney = (amount: string) => new Intl.NumberFormat(bn ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(amount));

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <Link href={routeBase} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{bn ? "সব নির্মাণসেবা" : "All construction services"}</Link>
      <section className="grid gap-6 rounded-[2rem] border border-primary/15 bg-gradient-to-br from-secondary/80 via-card to-card p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-end">
        <div><span aria-hidden="true" className="text-5xl">{service.icon}</span><p className="mt-4 text-sm font-semibold text-primary">{bn ? "নির্মাণ সেবা" : "Construction service"}</p><h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{bn ? service.titleBn : service.titleEn}</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{bn ? service.descriptionBn : service.descriptionEn}</p></div>
        <div className="flex flex-wrap gap-3"><Link href={projectHref} className={buttonVariants({ size: "lg" })}>{bn ? "এই সেবার প্রকল্প তৈরি করুন" : "Create a project for this service"}<ArrowRightIcon data-icon="inline-end" /></Link><Link href={`${routeBase}/market?${marketParams}`} className={buttonVariants({ variant: "outline", size: "lg" })}>{bn ? "মার্কেটপ্লেস দেখুন" : "Browse marketplace"}</Link></div>
      </section>
      <section className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-primary">{bn ? "অনুমোদিত নির্মাণসেবা" : "Approved construction listings"}</p><h2 className="mt-1 text-2xl font-bold">{bn ? "এই সেবার জন্য তালিকা" : `Listings for ${service.titleEn.toLocaleLowerCase()}`}</h2></div><Link href={`${routeBase}/market?${marketParams}`} className={buttonVariants({ variant: "outline", size: "sm" })}>{bn ? "সব ফলাফল" : "View all results"}<ArrowRightIcon data-icon="inline-end" /></Link></div>
        {result.unavailable ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{t.workflow.dataUnavailable}</p> : result.items.length === 0 ? <div className="rounded-2xl border border-dashed p-7"><p className="text-sm text-muted-foreground">{bn ? "এই সেবার কোনো অনুমোদিত তালিকা এখনো নেই। প্রকল্প তৈরি করে আপনার কাজের জন্য সেবাদাতাদের আমন্ত্রণ জানান।" : "There are no approved listings for this service yet. Create a project to invite providers for your specific work."}</p><Link href={projectHref} className={cn(buttonVariants({ variant: "outline" }), "mt-4")}>{bn ? "প্রকল্প তৈরি করুন" : "Create a project"}<ArrowRightIcon data-icon="inline-end" /></Link></div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{result.items.map((listing) => <Card key={listing.id} className="h-full overflow-hidden"><ListingImage listing={listing} alt={bn ? listing.titleBn : listing.titleEn} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><CardHeader><CardTitle>{bn ? listing.titleBn : listing.titleEn}</CardTitle><CardDescription className="flex flex-wrap items-center gap-2"><span className="inline-flex items-center gap-1"><MapPinIcon aria-hidden="true" className="size-4" />{listing.district}</span><span aria-hidden="true">·</span><span>{listing.category}</span></CardDescription></CardHeader><CardContent><p className="line-clamp-2 text-sm text-muted-foreground">{bn ? listing.descriptionBn : listing.descriptionEn}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="font-semibold text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</span>{listing.averageRating !== null && <span className="inline-flex items-center gap-1 text-sm"><StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />{listing.averageRating.toFixed(1)} ({listing.reviewCount})</span>}</div><Link href={`${routeBase}/listings/${listing.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}>{bn ? "বিস্তারিত" : "Details"}<ArrowRightIcon data-icon="inline-end" /></Link></CardContent></Card>)}</div>}
      </section>
    </main>
  );
}
