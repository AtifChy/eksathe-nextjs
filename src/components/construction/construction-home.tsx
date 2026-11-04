"use client";

import { cn } from "cn";
import { ArrowRightIcon, Building2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { ConstructionCommissionCalculator } from "@/components/construction/construction-commission-calculator";
import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  constructionServiceCategories,
  constructionServiceRegistry,
} from "@/lib/construction/service-registry";
import type { PublicListing } from "@/lib/listings";

export function ConstructionHome({
  routeBase,
  showDashboardBackLink,
  listings,
  unavailable,
  commissionRate,
}: {
  routeBase: string;
  showDashboardBackLink: boolean;
  listings: PublicListing[];
  unavailable: boolean;
  commissionRate: string | null;
}) {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const english = locale === "en";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const services = useMemo(
    () =>
      constructionServiceRegistry.filter((service) => {
        const content =
          `${service.titleEn} ${service.titleBn} ${service.descriptionEn} ${service.descriptionBn} ${service.slug}`.toLocaleLowerCase();
        return (
          (!normalizedQuery || content.includes(normalizedQuery)) &&
          (category === "all" || service.group === category)
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
            {english ? "Construction services across Bangladesh" : "সারা বাংলাদেশের নির্মাণসেবা"}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {english
              ? "Plan your build and find the right people."
              : "পরিকল্পনা করুন, সঠিক নির্মাণসেবা খুঁজে নিন।"}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-7">
            {english
              ? "Find approved professionals and material suppliers, compare project quotes, and keep work, milestones, and payments together."
              : "অনুমোদিত পেশাজীবী ও সামগ্রী সরবরাহকারী খুঁজুন, প্রকল্পের দরপ্রস্তাব তুলনা করুন এবং কাজ, মাইলফলক ও পেমেন্টের তথ্য একসাথে রাখুন।"}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`${routeBase}/market`}
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              {english ? "Explore construction marketplace" : "নির্মাণ মার্কেটপ্লেস দেখুন"}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="/account/projects/new?service=contractors"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {english ? "Start a project" : "প্রকল্প শুরু করুন"}
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Card className="min-h-36">
            <CardContent className="flex h-full flex-col justify-between p-5">
              <span className="text-4xl" aria-hidden="true">
                👷
              </span>
              <div>
                <p className="text-2xl font-bold">
                  {constructionServiceRegistry.length.toLocaleString(english ? "en-BD" : "bn-BD")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {english ? "Construction service areas" : "নির্মাণ সেবার ধরন"}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="min-h-36">
            <CardContent className="flex h-full flex-col justify-between p-5">
              <span className="text-4xl" aria-hidden="true">
                🧱
              </span>
              <div>
                <p className="text-2xl font-bold">
                  {listings.length.toLocaleString(english ? "en-BD" : "bn-BD")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {english ? "Published offers" : "প্রকাশিত তালিকা"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="marketplace" className="flex scroll-mt-24 flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-primary text-sm font-semibold">
              {english ? "Professionals and materials" : "পেশাজীবী ও নির্মাণসামগ্রী"}
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {english ? "Construction marketplace" : "নির্মাণ মার্কেটপ্লেস"}
            </h2>
          </div>
          <Link
            href={`${routeBase}/market`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            {english ? "View all offers" : "সব তালিকা দেখুন"}
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
              ? "No approved construction listings yet. Please check back soon."
              : "এখনো কোনো অনুমোদিত নির্মাণ তালিকা নেই। পরে আবার দেখুন।"}
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
            {english ? "8 construction service areas" : "৮টি নির্মাণ সেবার ধরন"}
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {english ? "What do you need for your project?" : "আপনার প্রকল্পে কী ধরনের সহায়তা প্রয়োজন?"}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            {english
              ? "Browse an approved provider or create a project to invite several professionals and compare their quotes."
              : "অনুমোদিত সেবাদাতা দেখুন অথবা প্রকল্প তৈরি করে একাধিক পেশাজীবীকে দরপ্রস্তাবের জন্য আমন্ত্রণ জানান।"}
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
              placeholder={english ? "Search construction services" : "নির্মাণসেবা খুঁজুন"}
              aria-label={english ? "Search construction services" : "নির্মাণসেবা খুঁজুন"}
              className="pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label={english ? "Filter by service area" : "সেবার ধরন অনুযায়ী দেখুন"}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="all">{english ? "All service areas" : "সব সেবার ধরন"}</option>
            {constructionServiceCategories.map((item) => (
              <option key={item.id} value={item.id}>
                {english ? item.labelEn : item.labelBn}
              </option>
            ))}
          </select>
        </div>
        {services.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed p-8 text-center text-sm">
            {english
              ? "No service areas match your search."
              : "আপনার অনুসন্ধানে কোনো সেবার ধরন পাওয়া যায়নি।"}
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
                      {service.kind === "CONSTRUCTION_MATERIAL"
                        ? english
                          ? "Materials"
                          : "নির্মাণসামগ্রী"
                        : english
                          ? "Find professionals"
                          : "পেশাজীবী দেখুন"}
                    </span>
                    <ArrowRightIcon aria-hidden="true" className="size-4" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section id="how" className="flex flex-col gap-5">
        <div>
          <p className="text-primary text-sm font-semibold">
            {english ? "A clear way to organize your build" : "নির্মাণকাজ গুছিয়ে এগিয়ে নিন"}
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            {english ? "How construction projects work" : "নির্মাণ প্রকল্প যেভাবে এগোয়"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: "📝",
              titleEn: "Describe the work",
              titleBn: "কাজের বিবরণ দিন",
              bodyEn: "Create a private project with location, scope, budget, and dates.",
              bodyBn: "অবস্থান, কাজের পরিধি, বাজেট ও তারিখ দিয়ে ব্যক্তিগত প্রকল্প তৈরি করুন।",
            },
            {
              icon: "📨",
              titleEn: "Invite providers",
              titleBn: "সেবাদাতাদের আমন্ত্রণ",
              bodyEn: "Share each work package with approved professionals or suppliers.",
              bodyBn: "প্রতিটি কাজের প্যাকেজ অনুমোদিত পেশাজীবী বা সরবরাহকারীদের পাঠান।",
            },
            {
              icon: "⚖️",
              titleEn: "Compare and agree",
              titleBn: "তুলনা করে সম্মত হন",
              bodyEn: "Review scope, price, transport, and schedule before accepting a quote.",
              bodyBn: "দরপ্রস্তাব গ্রহণের আগে কাজ, মূল্য, পরিবহন ও সময়সূচি তুলনা করুন।",
            },
            {
              icon: "✅",
              titleEn: "Track to handover",
              titleBn: "কাজ শেষ করে হস্তান্তর",
              bodyEn: "Follow milestones and payment records, then confirm completed work.",
              bodyBn: "মাইলফলক ও পেমেন্টের তথ্য দেখুন, কাজ শেষে সম্পন্ন হওয়া নিশ্চিত করুন।",
            },
          ].map((step, index) => (
            <Card key={step.titleEn}>
              <CardContent className="flex h-full flex-col gap-3 p-5">
                <span
                  className="bg-primary/10 flex size-10 items-center justify-center rounded-full text-xl"
                  aria-hidden="true"
                >
                  {step.icon}
                </span>
                <p className="text-primary text-xs font-semibold">
                  {(index + 1).toLocaleString(english ? "en-BD" : "bn-BD")}
                </p>
                <h3 className="font-semibold">{english ? step.titleEn : step.titleBn}</h3>
                <p className="text-muted-foreground text-sm leading-6">
                  {english ? step.bodyEn : step.bodyBn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
              ? "The estimate uses the current construction rate and excludes separately agreed transport charges."
              : "এই হিসাবে নির্মাণ খাতের বর্তমান কমিশন হার ব্যবহার হয় এবং আলাদা পরিবহন খরচ অন্তর্ভুক্ত নয়।"}
          </p>
        </div>
        <ConstructionCommissionCalculator ratePercent={commissionRate} />
      </section>

      <section className="bg-card grid gap-4 rounded-3xl border p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div className="flex items-start gap-4">
          <Building2Icon aria-hidden="true" className="text-primary mt-1 size-8 shrink-0" />
          <div>
            <h2 className="text-xl font-bold">
              {english ? "Keep your project in one place" : "প্রকল্পের তথ্য এক জায়গায় রাখুন"}
            </h2>
            <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6">
              {english
                ? "Track providers, material orders, project milestones, private documents, expenses, and payment confirmations in your account."
                : "আপনার অ্যাকাউন্ট থেকে সেবাদাতা, সামগ্রীর অর্ডার, প্রকল্পের মাইলফলক, ব্যক্তিগত নথি, খরচ ও পেমেন্ট নিশ্চিতকরণ দেখুন।"}
            </p>
          </div>
        </div>
        <Link
          href="/account/projects/new?service=contractors"
          className={buttonVariants({ size: "lg" })}
        >
          {english ? "Create a project" : "প্রকল্প তৈরি করুন"}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </section>
    </div>
  );
}
