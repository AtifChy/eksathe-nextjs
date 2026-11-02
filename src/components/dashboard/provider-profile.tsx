"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, MapPinIcon, StarIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { WorkspaceError } from "@/components/workflows/workspace-error";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import type { PublicProvider } from "@/lib/listings";
import type { SectorDefinition } from "@/lib/sectors";
import { cn } from "cn";

export function ProviderProfile({ provider, sector, unavailable }: { provider: PublicProvider | null; sector: SectorDefinition; unavailable: boolean }) {
  const { locale, t } = useLanguage();
  if (unavailable) return <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6"><WorkspaceError /></div>;
  if (!provider) return null;
  const formatMoney = (value: string) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6">
      <Link href={`/dashboard/${sector.slug}`} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{t.nav.browse}</Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{locale === "bn" ? provider.nameBn : provider.nameEn}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-3"><span className="inline-flex items-center gap-1"><MapPinIcon aria-hidden="true" className="size-4" />{provider.district}{provider.upazila ? `, ${provider.upazila}` : ""}</span>{provider.averageRating !== null && <span className="inline-flex items-center gap-1"><StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />{provider.averageRating.toFixed(1)} · {provider.reviewCount} {locale === "bn" ? "টি রিভিউ" : "reviews"}</span>}</CardDescription>
        </CardHeader>
        <CardContent><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{locale === "bn" ? provider.bioBn : provider.bioEn}</p></CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "সেবা ও তালিকা" : "Services and listings"}</h2>
        {provider.listings.length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{t.workflow.noRecords}</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{provider.listings.map((listing) => <Card key={listing.id}>{listing.hasImage && <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl bg-muted"><Image src={`/api/listings/${listing.id}/image`} alt={locale === "bn" ? listing.titleBn : listing.titleEn} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" unoptimized /></div>}<CardHeader><CardTitle>{locale === "bn" ? listing.titleBn : listing.titleEn}</CardTitle><CardDescription>{listing.district} · {listing.category}</CardDescription></CardHeader><CardContent><p className="line-clamp-3 text-sm text-muted-foreground">{locale === "bn" ? listing.descriptionBn : listing.descriptionEn}</p><div className="mt-4 flex items-center justify-between gap-2"><span className="text-sm font-semibold text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</span><Link href={`/dashboard/${sector.slug}/listings/${listing.id}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>{locale === "bn" ? "বিস্তারিত" : "Details"}</Link></div></CardContent></Card>)}</div>}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "গ্রাহক মতামত" : "Customer reviews"}</h2>
        {provider.reviews.length === 0 ? <p className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{locale === "bn" ? "সম্পন্ন অর্ডারে রিভিউ এলে এখানে দেখা যাবে।" : "Reviews from completed orders will appear here."}</p> : provider.reviews.map((review, index) => <Card key={`${review.createdAt}-${index}`}><CardContent className="flex flex-col gap-2 p-4"><p className="inline-flex items-center gap-1 text-sm font-semibold"><StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />{review.rating} / 5</p><p className="whitespace-pre-line text-sm text-muted-foreground">{review.comment}</p><p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD")}</p></CardContent></Card>)}
      </section>
    </div>
  );
}
