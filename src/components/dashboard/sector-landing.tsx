"use client";

import { cn } from "cn";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PublicListing } from "@/lib/listings";
import type { agricultureListings, constructionListings, SectorDefinition } from "@/lib/sectors";

type Service = (typeof agricultureListings)[number] | (typeof constructionListings)[number];

export function SectorLanding({
  sector,
  listings,
  unavailable = false,
  services,
}: {
  sector: SectorDefinition;
  listings: PublicListing[];
  unavailable?: boolean;
  services: Service[];
}) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState("");
  const title = locale === "bn" ? sector.labelBn : sector.labelEn;
  const price = (value: string) =>
    new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(Number(value));
  const districts = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.district))).sort(),
    [listings],
  );
  const term = query.trim().toLowerCase();
  const matches = (listing: PublicListing) => {
    const searchable =
      `${listing.titleBn} ${listing.titleEn} ${listing.descriptionBn} ${listing.descriptionEn} ${listing.category} ${listing.district}`.toLowerCase();
    return (!term || searchable.includes(term)) && (!district || listing.district === district);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm"
      >
        <ArrowLeftIcon aria-hidden="true" className="size-4" />
        {t.nav.browse}
      </Link>
      <section className="border-border/70 bg-card rounded-3xl border p-6 shadow-xs sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl" aria-hidden="true">
              {sector.icon}
            </span>
            <div>
              <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                {locale === "bn" ? sector.labelEn : sector.labelBn}
              </p>
              <h1 className="text-foreground mt-1 text-3xl font-bold tracking-tight">{title}</h1>
            </div>
          </div>
          {sector.status === "live" && (
            <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold">
              {t.nav.live}
            </span>
          )}
        </div>
        {sector.status !== "live" ? (
          <p className="text-muted-foreground mt-6 max-w-xl text-sm leading-6">
            {t.nav.comingSoon}
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            {services.map((service) => (
              <a
                key={service.slug}
                href={`#${service.slug}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
              >
                <span aria-hidden="true">{service.icon}</span>
                {locale === "bn" ? service.titleBn : service.titleEn}
              </a>
            ))}
            {sector.slug === "construction" && (
              <Link href="/account/projects/new" className={buttonVariants({ size: "sm" })}>
                <PlusIcon data-icon="inline-start" />
                {locale === "bn" ? "প্রকল্প তৈরি করুন" : "Create a project"}
              </Link>
            )}
          </div>
        )}
      </section>

      {sector.status === "live" && (
        <div className="flex flex-col gap-10">
          <div className="border-border/70 bg-card grid gap-3 rounded-2xl border p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.workflow.searchListings}
              aria-label={t.workflow.searchListings}
            />
            <select
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              aria-label={t.workflow.district}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              <option value="">{t.workflow.allDistricts}</option>
              {districts.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {unavailable && (
            <p
              role="alert"
              className="border-destructive/30 bg-destructive/5 text-destructive rounded-xl border p-4 text-sm"
            >
              {t.workflow.dataUnavailable}
            </p>
          )}
          {services.map((service) => {
            const serviceListings = listings.filter(
              (listing) => listing.kind === service.kind && matches(listing),
            );
            return (
              <section
                key={service.slug}
                id={service.slug}
                className="flex scroll-mt-24 flex-col gap-4"
              >
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-foreground text-xl font-bold">
                      {locale === "bn" ? service.titleBn : service.titleEn}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {serviceListings.length}{" "}
                      {locale === "bn" ? "টি সেবা তালিকা" : "available listings"}
                    </p>
                  </div>
                </div>
                {serviceListings.length === 0 && !unavailable ? (
                  <div className="border-border bg-card/70 rounded-2xl border border-dashed px-5 py-6">
                    <p className="text-muted-foreground text-sm">
                      {locale === "bn"
                        ? "এখনো কোনো অনুমোদিত তালিকা নেই। সেবাদাতা হিসেবে যোগ দিন।"
                        : "No approved listings yet. Apply to become a provider."}
                    </p>
                    <Link
                      href={`/register?next=${encodeURIComponent("/provider")}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
                    >
                      {locale === "bn" ? "সেবাদাতা হিসেবে যোগ দিন" : "Apply to provide"}
                      <ArrowRightIcon data-icon="inline-end" />
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceListings.map((listing) => (
                      <Link
                        key={listing.id}
                        href={`/dashboard/${sector.slug}/listings/${listing.id}`}
                        className="focus-visible:outline-primary rounded-2xl outline-offset-4 focus-visible:outline-2"
                      >
                        <Card className="hover:border-primary/40 h-full transition-colors">
                          <ListingImage
                            listing={listing}
                            alt={locale === "bn" ? listing.titleBn : listing.titleEn}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <CardHeader>
                            <CardTitle>
                              {locale === "bn" ? listing.titleBn : listing.titleEn}
                            </CardTitle>
                            <CardDescription>
                              {locale === "bn" ? listing.providerNameBn : listing.providerNameEn} ·{" "}
                              {listing.district}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {locale === "bn" ? listing.descriptionBn : listing.descriptionEn}
                            </p>
                            <div className="mt-4 flex items-center justify-between gap-2">
                              <span className="text-primary font-semibold">
                                {price(listing.unitPrice)} / {listing.unit}
                              </span>
                              <Button tabIndex={-1} size="sm" variant="outline">
                                {locale === "bn" ? "বিস্তারিত" : "View"}
                                <ArrowRightIcon data-icon="inline-end" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
