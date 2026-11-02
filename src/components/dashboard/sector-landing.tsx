"use client";

import Link from "next/link";
import { ListingImage } from "@/components/dashboard/listing-image";
import { useMemo, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PublicListing } from "@/lib/listings";
import type { agricultureListings, constructionListings, SectorDefinition } from "@/lib/sectors";
import { cn } from "cn";

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
  const price = (value: string) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));
  const districts = useMemo(() => Array.from(new Set(listings.map((listing) => listing.district))).sort(), [listings]);
  const term = query.trim().toLowerCase();
  const matches = (listing: PublicListing) => {
    const searchable = `${listing.titleBn} ${listing.titleEn} ${listing.descriptionBn} ${listing.descriptionEn} ${listing.category} ${listing.district}`.toLowerCase();
    return (!term || searchable.includes(term)) && (!district || listing.district === district);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-9 px-4 py-8 sm:px-6">
      <Link href="/dashboard" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon aria-hidden="true" className="size-4" />{t.nav.browse}
      </Link>
      <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-xs sm:p-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="text-5xl" aria-hidden="true">{sector.icon}</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{locale === "bn" ? sector.labelEn : sector.labelBn}</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            </div>
          </div>
          {sector.status === "live" && (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">{t.nav.live}</span>
          )}
        </div>
        {sector.status !== "live" ? (
          <p className="mt-6 max-w-xl text-sm leading-6 text-muted-foreground">{t.nav.comingSoon}</p>
        ) : (
          <div className="mt-6 flex flex-wrap gap-3">
            {services.map((service) => (
              <a key={service.slug} href={`#${service.slug}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}>
                <span aria-hidden="true">{service.icon}</span>{locale === "bn" ? service.titleBn : service.titleEn}
              </a>
            ))}
            {sector.slug === "construction" && (
              <Link href="/account/projects/new" className={buttonVariants({ size: "sm" })}>
                <PlusIcon data-icon="inline-start" />{locale === "bn" ? "প্রকল্প তৈরি করুন" : "Create a project"}
              </Link>
            )}
          </div>
        )}
      </section>

      {sector.status === "live" && (
        <div className="flex flex-col gap-10">
          <div className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 sm:grid-cols-[minmax(0,1fr)_220px]">
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.workflow.searchListings} aria-label={t.workflow.searchListings} />
            <select value={district} onChange={(event) => setDistrict(event.target.value)} aria-label={t.workflow.district} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
              <option value="">{t.workflow.allDistricts}</option>
              {districts.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          {unavailable && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{t.workflow.dataUnavailable}</p>}
          {services.map((service) => {
            const serviceListings = listings.filter((listing) => listing.kind === service.kind && matches(listing));
            return (
              <section key={service.slug} id={service.slug} className="flex flex-col gap-4 scroll-mt-24">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{locale === "bn" ? service.titleBn : service.titleEn}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{serviceListings.length} {locale === "bn" ? "টি সেবা তালিকা" : "available listings"}</p>
                  </div>
                </div>
                {serviceListings.length === 0 && !unavailable ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/70 px-5 py-6">
                    <p className="text-sm text-muted-foreground">{locale === "bn" ? "এখনো কোনো অনুমোদিত তালিকা নেই। সেবাদাতা হিসেবে যোগ দিন।" : "No approved listings yet. Apply to become a provider."}</p>
                    <Link href={`/register?next=${encodeURIComponent("/provider")}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}>{locale === "bn" ? "সেবাদাতা হিসেবে যোগ দিন" : "Apply to provide"}<ArrowRightIcon data-icon="inline-end" /></Link>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {serviceListings.map((listing) => (
                      <Link key={listing.id} href={`/dashboard/${sector.slug}/listings/${listing.id}`} className="rounded-2xl outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">
                        <Card className="h-full transition-colors hover:border-primary/40">
                          <ListingImage listing={listing} alt={locale === "bn" ? listing.titleBn : listing.titleEn} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                          <CardHeader>
                            <CardTitle>{locale === "bn" ? listing.titleBn : listing.titleEn}</CardTitle>
                            <CardDescription>{locale === "bn" ? listing.providerNameBn : listing.providerNameEn} · {listing.district}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="line-clamp-2 text-sm text-muted-foreground">{locale === "bn" ? listing.descriptionBn : listing.descriptionEn}</p>
                            <div className="mt-4 flex items-center justify-between gap-2">
                              <span className="font-semibold text-primary">{price(listing.unitPrice)} / {listing.unit}</span>
                              <Button tabIndex={-1} size="sm" variant="outline">{locale === "bn" ? "বিস্তারিত" : "View"}<ArrowRightIcon data-icon="inline-end" /></Button>
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
