"use client";

import { cn } from "cn";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AgricultureCommissionCalculator } from "@/components/agriculture/agriculture-commission-calculator";
import { BrandLogo } from "@/components/brand-logo";
import { ListingImage } from "@/components/dashboard/listing-image";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AgriculturePublicInfo } from "@/lib/agriculture/publishing";
import {
  agricultureServiceCategories,
  agricultureServiceRegistry,
} from "@/lib/agriculture/service-registry";
import type { PublicListing } from "@/lib/listings";

export function AgricultureHome({
  routeBase,
  showDashboardBackLink,
  listings,
  unavailable,
  publicInfo,
}: {
  routeBase: string;
  showDashboardBackLink: boolean;
  listings: PublicListing[];
  unavailable: boolean;
  publicInfo: AgriculturePublicInfo;
}) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const english = locale === "en";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const services = useMemo(
    () =>
      agricultureServiceRegistry.filter((service) => {
        const content =
          `${service.titleEn} ${service.titleBn} ${service.descriptionEn} ${service.descriptionBn} ${service.slug}`.toLocaleLowerCase();
        return (
          (!normalizedQuery || content.includes(normalizedQuery)) &&
          (category === "all" || service.categoryId === category)
        );
      }),
    [normalizedQuery, category],
  );
  const formatMoney = (amount: string) =>
    new Intl.NumberFormat(english ? "en-BD" : "bn-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(Number(amount));

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14 px-4 py-8 sm:px-6 sm:py-12">
      {showDashboardBackLink && (
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm font-medium"
        >
          ← {english ? "Back to dashboard" : "ড্যাশবোর্ডে ফিরে যান"}
        </Link>
      )}

      <section className="border-primary/15 from-secondary/80 via-card to-card grid gap-8 overflow-hidden rounded-[2rem] border bg-gradient-to-br p-6 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="mb-5">
            <BrandLogo />
          </div>
          <p className="text-primary text-sm font-semibold tracking-wide uppercase">
            {english ? "Agriculture services across Bangladesh" : "সারা বাংলাদেশের কৃষিসেবা"}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {english
              ? "Grow, find support, and reach markets together."
              : "একসাথে এগিয়ে যাক কৃষি, সহায়তা ও বাজার সংযোগ।"}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
            {english
              ? "Find farm products, workers, machinery, advice, and support in one place. Browse freely; verified accounts can send a request for the operations team to review."
              : "কৃষিপণ্য, শ্রমিক, যন্ত্রপাতি, পরামর্শ ও সহায়তা এক জায়গায় খুঁজুন। সবাই সেবা দেখতে পারবেন; যাচাইকৃত অ্যাকাউন্ট থেকে অনুরোধ পাঠালে পরিচালনা দল তা পর্যালোচনা করবে।"}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="#marketplace" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
              {english ? "Explore marketplace" : "বাজার দেখুন"}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link href="#services" className={buttonVariants({ variant: "outline", size: "lg" })}>
              {english ? "Browse all 30 services" : "৩০টি সেবা দেখুন"}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {[
            { icon: "🌾", title: english ? "Farm services" : "কৃষিসেবা", count: 30 },
            { icon: "🛒", title: english ? "Marketplace" : "কৃষিপণ্যের বাজার", count: listings.length },
          ].map((item) => (
            <Card key={item.title} className="min-h-36">
              <CardContent className="flex h-full flex-col justify-between p-5">
                <span className="text-4xl" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <p className="text-2xl font-bold">
                    {item.count.toLocaleString(english ? "en-BD" : "bn-BD")}
                    {item.icon === "🌾" ? "+" : ""}
                  </p>
                  <p className="text-muted-foreground text-sm">{item.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="marketplace" className="flex scroll-mt-24 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-primary text-sm font-semibold">
              {english ? "Find products and providers" : "পণ্য ও সেবাদাতা খুঁজুন"}
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {english ? "Agriculture marketplace" : "কৃষি মার্কেটপ্লেস"}
            </h2>
          </div>
          <Link
            href={`${routeBase}/market`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {english ? "View marketplace" : "সব তালিকা দেখুন"}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
        {unavailable && (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-4 text-sm"
          >
            {english
              ? "Marketplace listings could not be loaded. Please try again later."
              : "মার্কেটপ্লেসের তালিকা লোড করা যায়নি। পরে আবার চেষ্টা করুন।"}
          </p>
        )}
        {!unavailable && listings.length === 0 ? (
          <div className="text-muted-foreground rounded-2xl border border-dashed p-6 text-sm">
            {english
              ? "No published listings yet. Please check back soon."
              : "এখনো কোনো প্রকাশিত তালিকা নেই। পরে আবার দেখুন।"}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {listings.slice(0, 3).map((listing) => (
              <Link
                key={listing.id}
                href={`${routeBase}/listings/${listing.id}`}
                className="focus-visible:outline-primary rounded-2xl outline-offset-4 focus-visible:outline-2"
              >
                <Card className="hover:border-primary/40 h-full transition-colors">
                  <ListingImage
                    listing={listing}
                    alt={english ? listing.titleEn : listing.titleBn}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <CardHeader>
                    <CardTitle>{english ? listing.titleEn : listing.titleBn}</CardTitle>
                    <CardDescription>
                      {english ? listing.providerNameEn : listing.providerNameBn} ·{" "}
                      {listing.district}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {english ? listing.descriptionEn : listing.descriptionBn}
                    </p>
                    <p className="text-primary mt-3 font-semibold">
                      {formatMoney(listing.unitPrice)} / {listing.unit}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="services" className="flex scroll-mt-24 flex-col gap-5">
        <div>
          <p className="text-primary text-sm font-semibold">
            {english ? "30 agriculture services" : "৩০টি কৃষিসেবা"}
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {english ? "What do you need help with?" : "কোন সেবাটি আপনার প্রয়োজন?"}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            {english
              ? "Choose a service to see its details and request form. The agriculture operations team reviews and coordinates service requests."
              : "সেবার বিবরণ ও অনুরোধের ফর্ম দেখতে একটি সেবা বেছে নিন। কৃষি পরিচালনা দল অনুরোধ যাচাই ও সমন্বয় করবে।"}
          </p>
        </div>
        <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={english ? "Search services" : "সেবা খুঁজুন"}
              aria-label={english ? "Search services" : "সেবা খুঁজুন"}
              className="pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label={english ? "Filter by category" : "ক্যাটাগরি অনুযায়ী দেখুন"}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="all">{english ? "All categories" : "সব ক্যাটাগরি"}</option>
            {agricultureServiceCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {english ? item.labelEn : item.labelBn}
              </option>
            ))}
          </select>
        </div>
        {services.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
            {english ? "No services match your search." : "আপনার অনুসন্ধানে কোনো সেবা পাওয়া যায়নি।"}
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`${routeBase}/services/${service.slug}`}
                className="focus-visible:outline-primary rounded-2xl outline-offset-4 focus-visible:outline-2"
              >
                <Card className="hover:border-primary/40 h-full transition-colors">
                  <CardHeader className="flex-row items-start gap-3">
                    <span aria-hidden="true" className="text-3xl">
                      {service.icon}
                    </span>
                    <div>
                      <CardTitle className="text-base">
                        {english ? service.titleEn : service.titleBn}
                      </CardTitle>
                      <CardDescription className="mt-2 line-clamp-2">
                        {english ? service.descriptionEn : service.descriptionBn}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="text-muted-foreground flex items-center justify-between text-xs">
                    <span>
                      {service.fields.length.toLocaleString(english ? "en-BD" : "bn-BD")}{" "}
                      {english ? "service details" : "টি বিস্তারিত তথ্য"}
                    </span>
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <HowItWorksSection />
      <section
        id="commission"
        className="bg-secondary/40 grid items-center gap-6 rounded-3xl border p-5 sm:p-8 lg:grid-cols-2"
      >
        <div>
          <p className="text-primary text-sm font-semibold">
            {english ? "Commission calculator" : "কমিশন ক্যালকুলেটর"}
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {english ? "Estimate the platform fee" : "প্ল্যাটফর্ম ফি সম্পর্কে ধারণা নিন"}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {english
              ? "This estimate uses the current agriculture rate. It does not include separately agreed transport costs."
              : "এই হিসাবে কৃষির বর্তমান কমিশন হার ব্যবহার করা হয়। আলাদাভাবে নির্ধারিত পরিবহন খরচ এতে অন্তর্ভুক্ত নয়।"}
          </p>
        </div>
        <AgricultureCommissionCalculator ratePercent={publicInfo.commissionRate} />
      </section>

      <section className="bg-secondary/50 rounded-3xl border p-6 sm:p-8">
        <p className="text-primary text-sm font-semibold">
          {english ? "Reviewed by the agriculture team" : "কৃষি পরিচালনা দলের যাচাইকৃত তথ্য"}
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">
              {english ? "Market prices and agriculture updates" : "বাজারদর ও কৃষি আপডেট"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
              {english
                ? "Market prices, news, advice, and weather alerts are published by staff with a source and date."
                : "বাজারদর, খবর, পরামর্শ ও আবহাওয়া সতর্কতা পরিচালনা দলের মাধ্যমে উৎস ও তারিখসহ প্রকাশ করা হয়।"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`${routeBase}/market-prices`}
              className={buttonVariants({ variant: "outline" })}
            >
              {english ? "Market prices" : "বাজারদর"}
            </Link>
            <Link href={`${routeBase}/updates`} className={buttonVariants({ variant: "outline" })}>
              {english ? "Updates" : "আপডেট"}
            </Link>
          </div>
        </div>
        {publicInfo.unavailable ? (
          <p role="alert" className="text-destructive mt-4 text-sm">
            {english
              ? "Published information is temporarily unavailable."
              : "প্রকাশিত তথ্য সাময়িকভাবে পাওয়া যাচ্ছে না।"}
          </p>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {english ? "Latest market prices" : "সর্বশেষ বাজারদর"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {publicInfo.prices.length ? (
                  publicInfo.prices.slice(0, 3).map((price) => (
                    <p key={price.id} className="text-sm">
                      <strong>{english ? price.productEn : price.productBn}</strong> ·{" "}
                      {price.market}, {price.district} · {formatMoney(price.price)} / {price.unit}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {english ? "No published market prices yet." : "এখনো কোনো বাজারদর প্রকাশিত হয়নি।"}
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {english ? "Recent updates" : "সাম্প্রতিক আপডেট"}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {publicInfo.updates.length ? (
                  publicInfo.updates.slice(0, 3).map((update) => (
                    <p key={update.id} className="text-sm">
                      <strong>{english ? update.titleEn : update.titleBn}</strong> ·{" "}
                      {new Intl.DateTimeFormat(english ? "en-BD" : "bn-BD", {
                        dateStyle: "medium",
                        timeZone: "Asia/Dhaka",
                      }).format(new Date(update.publishedAt))}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {english ? "No current agriculture updates." : "বর্তমানে কোনো কৃষি আপডেট নেই।"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <section
        aria-labelledby="agriculture-support-heading"
        className="rounded-2xl border p-5 sm:p-6"
      >
        <h2 id="agriculture-support-heading" className="text-lg font-bold">
          {english ? "Agriculture support" : "কৃষি সহায়তা"}
        </h2>
        {publicInfo.unavailable ? (
          <p className="text-muted-foreground mt-2 text-sm">
            {english ? "Support information could not be loaded." : "সহায়তার তথ্য লোড করা যায়নি।"}
          </p>
        ) : publicInfo.support &&
          (publicInfo.support.phone ||
            publicInfo.support.email ||
            publicInfo.support.messageBn ||
            publicInfo.support.messageEn) ? (
          <div className="mt-2 flex flex-col gap-2 text-sm">
            <p>{english ? publicInfo.support.messageEn : publicInfo.support.messageBn}</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {publicInfo.support.phone && (
                <a
                  className="text-primary font-medium hover:underline"
                  href={`tel:${publicInfo.support.phone.replace(/[^+\d]/g, "")}`}
                >
                  {publicInfo.support.phone}
                </a>
              )}
              {publicInfo.support.email && (
                <a
                  className="text-primary font-medium hover:underline"
                  href={`mailto:${publicInfo.support.email}`}
                >
                  {publicInfo.support.email}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground mt-2 text-sm">
            {english
              ? "Support contact details have not been configured yet."
              : "সহায়তার যোগাযোগের তথ্য এখনো নির্ধারণ করা হয়নি।"}
          </p>
        )}
      </section>
    </div>
  );
}
