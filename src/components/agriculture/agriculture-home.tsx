"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { ListingImage } from "@/components/dashboard/listing-image";
import { CommissionSection } from "@/components/landing/commission-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { agricultureServiceCategories, agricultureServiceRegistry } from "@/lib/agriculture/service-registry";
import type { PublicListing } from "@/lib/listings";
import { cn } from "cn";

export function AgricultureHome({
  routeBase,
  showDashboardBackLink,
  listings,
  unavailable,
}: {
  routeBase: string;
  showDashboardBackLink: boolean;
  listings: PublicListing[];
  unavailable: boolean;
}) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const english = locale === "en";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const services = useMemo(() => agricultureServiceRegistry.filter((service) => {
    const content = `${service.titleEn} ${service.titleBn} ${service.descriptionEn} ${service.descriptionBn} ${service.slug}`.toLocaleLowerCase();
    return (!normalizedQuery || content.includes(normalizedQuery)) && (category === "all" || service.categoryId === category);
  }), [normalizedQuery, category]);
  const formatMoney = (amount: string) => new Intl.NumberFormat(english ? "en-BD" : "bn-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(amount));

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 py-8 sm:px-6 sm:py-12">
      {showDashboardBackLink && <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">← {english ? "Back to dashboard" : "ড্যাশবোর্ডে ফিরে যান"}</Link>}

      <section className="grid gap-8 overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-secondary/80 via-card to-card p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5"><BrandLogo /></div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{english ? "Agriculture services across Bangladesh" : "সারা বাংলাদেশের কৃষিসেবা"}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{english ? "Grow, find support, and reach markets together." : "একসাথে এগিয়ে যাক কৃষি, সহায়তা ও বাজার সংযোগ।"}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{english ? "Find farm products, workers, machinery, advice, and support in one place. Browse freely; verified accounts can send a request for the operations team to review." : "কৃষিপণ্য, শ্রমিক, যন্ত্রপাতি, পরামর্শ ও সহায়তা এক জায়গায় খুঁজুন। সবাই সেবা দেখতে পারবেন; যাচাইকৃত অ্যাকাউন্ট থেকে অনুরোধ পাঠালে পরিচালনা দল তা পর্যালোচনা করবে।"}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#marketplace" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>{english ? "Explore marketplace" : "বাজার দেখুন"}<ArrowRightIcon data-icon="inline-end" /></Link>
            <Link href="#services" className={buttonVariants({ variant: "outline", size: "lg" })}>{english ? "Browse all 30 services" : "৩০টি সেবা দেখুন"}</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[{ icon: "🌾", title: english ? "Farm services" : "কৃষিসেবা", count: 30 }, { icon: "🛒", title: english ? "Marketplace" : "কৃষিপণ্যের বাজার", count: listings.length }].map((item) => <Card key={item.title} className="min-h-36"><CardContent className="flex h-full flex-col justify-between p-5"><span className="text-4xl" aria-hidden="true">{item.icon}</span><div><p className="text-2xl font-bold">{item.count.toLocaleString(english ? "en-BD" : "bn-BD")}{item.icon === "🌾" ? "+" : ""}</p><p className="text-sm text-muted-foreground">{item.title}</p></div></CardContent></Card>)}
        </div>
      </section>

      <section id="marketplace" className="scroll-mt-24 flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-semibold text-primary">{english ? "Find products and providers" : "পণ্য ও সেবাদাতা খুঁজুন"}</p><h2 className="mt-1 text-2xl font-bold">{english ? "Agriculture marketplace" : "কৃষি মার্কেটপ্লেস"}</h2></div>
          <Link href={`${routeBase}/market`} className={buttonVariants({ variant: "outline", size: "sm" })}>{english ? "View marketplace" : "সব তালিকা দেখুন"}<ArrowRightIcon data-icon="inline-end" /></Link>
        </div>
        {unavailable && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{english ? "Marketplace listings could not be loaded. Please try again later." : "মার্কেটপ্লেসের তালিকা লোড করা যায়নি। পরে আবার চেষ্টা করুন।"}</p>}
        {!unavailable && listings.length === 0 ? <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">{english ? "No published listings yet. Please check back soon." : "এখনো কোনো প্রকাশিত তালিকা নেই। পরে আবার দেখুন।"}</div> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{listings.slice(0, 3).map((listing) => <Link key={listing.id} href={`${routeBase}/listings/${listing.id}`} className="rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"><Card className="h-full transition-colors hover:border-primary/40"><ListingImage listing={listing} alt={english ? listing.titleEn : listing.titleBn} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /><CardHeader><CardTitle>{english ? listing.titleEn : listing.titleBn}</CardTitle><CardDescription>{english ? listing.providerNameEn : listing.providerNameBn} · {listing.district}</CardDescription></CardHeader><CardContent><p className="line-clamp-2 text-sm text-muted-foreground">{english ? listing.descriptionEn : listing.descriptionBn}</p><p className="mt-3 font-semibold text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</p></CardContent></Card></Link>)}</div>}
      </section>

      <section id="services" className="scroll-mt-24 flex flex-col gap-5">
        <div><p className="text-sm font-semibold text-primary">{english ? "30 agriculture services" : "৩০টি কৃষিসেবা"}</p><h2 className="mt-1 text-2xl font-bold">{english ? "What do you need help with?" : "কোন সেবাটি আপনার প্রয়োজন?"}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{english ? "Choose a service to see its details and request form. The agriculture operations team reviews and coordinates service requests." : "সেবার বিবরণ ও অনুরোধের ফর্ম দেখতে একটি সেবা বেছে নিন। কৃষি পরিচালনা দল অনুরোধ যাচাই ও সমন্বয় করবে।"}</p></div>
        <div className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative"><SearchIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={english ? "Search services" : "সেবা খুঁজুন"} aria-label={english ? "Search services" : "সেবা খুঁজুন"} className="pl-9" /></div>
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label={english ? "Filter by category" : "ক্যাটাগরি অনুযায়ী দেখুন"} className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="all">{english ? "All categories" : "সব ক্যাটাগরি"}</option>{agricultureServiceCategories.map((item) => <option key={item.id} value={item.id}>{english ? item.labelEn : item.labelBn}</option>)}</select>
        </div>
        {services.length === 0 ? <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">{english ? "No services match your search." : "আপনার অনুসন্ধানে কোনো সেবা পাওয়া যায়নি।"}</p> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <Link key={service.slug} href={`${routeBase}/services/${service.slug}`} className="rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary"><Card className="h-full transition-colors hover:border-primary/40"><CardHeader className="flex-row items-start gap-3"><span aria-hidden="true" className="text-3xl">{service.icon}</span><div><CardTitle className="text-base">{english ? service.titleEn : service.titleBn}</CardTitle><CardDescription className="mt-2 line-clamp-2">{english ? service.descriptionEn : service.descriptionBn}</CardDescription></div></CardHeader><CardContent className="flex items-center justify-between text-xs text-muted-foreground"><span>{service.fields.length.toLocaleString(english ? "en-BD" : "bn-BD")} {english ? "service details" : "টি বিস্তারিত তথ্য"}</span><ArrowRightIcon aria-hidden="true" className="size-4" /></CardContent></Card></Link>)}</div>}
      </section>

      <HowItWorksSection />
      <CommissionSection />

      <section className="rounded-3xl border bg-secondary/50 p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">{english ? "Reviewed by the agriculture team" : "কৃষি পরিচালনা দলের যাচাইকৃত তথ্য"}</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-2xl font-bold">{english ? "Market prices and agriculture updates" : "বাজারদর ও কৃষি আপডেট"}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{english ? "Market prices, news, advice, and weather alerts are published by staff with a source and date." : "বাজারদর, খবর, পরামর্শ ও আবহাওয়া সতর্কতা পরিচালনা দলের মাধ্যমে উৎস ও তারিখসহ প্রকাশ করা হবে।"}</p></div><div className="flex gap-2"><Link href={`${routeBase}/market-prices`} className={buttonVariants({ variant: "outline" })}>{english ? "Market prices" : "বাজারদর"}</Link><Link href={`${routeBase}/updates`} className={buttonVariants({ variant: "outline" })}>{english ? "Updates" : "আপডেট"}</Link></div></div>
      </section>
    </div>
  );
}
