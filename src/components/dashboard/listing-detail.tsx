"use client";

import Link from "next/link";
import { ListingImage } from "@/components/dashboard/listing-image";
import { ArrowLeftIcon, ArrowRightIcon, MapPinIcon, PackageIcon, UserRoundIcon } from "lucide-react";
import { ListingRequestForm } from "@/components/workflows/listing-request-form";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicListing } from "@/lib/listings";
import type { SectorDefinition } from "@/lib/sectors";
import { cn } from "cn";

export function ListingDetail({
  sector,
  listing,
  unavailable,
  signedIn,
  projectId,
  packageLabel,
  routeBase,
}: {
  sector: SectorDefinition;
  listing: PublicListing | null;
  unavailable: boolean;
  signedIn: boolean;
  projectId?: string;
  packageLabel?: string;
  routeBase?: string;
}) {
  const { locale, t } = useLanguage();
  const price = (value: string) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));
  const base = routeBase ?? `/dashboard/${sector.slug}`;
  const returnTo = `${base}/listings/${listing?.id ?? ""}${projectId ? `?${new URLSearchParams({ projectId, ...(packageLabel ? { packageLabel } : {}) }).toString()}` : ""}`;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
      <div className="flex flex-col gap-6">
        <Link href={base} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon aria-hidden="true" className="size-4" />{locale === "bn" ? "সব সেবা" : "All services"}
        </Link>
        {unavailable ? (
          <p role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">{t.workflow.dataUnavailable}</p>
        ) : listing ? (
          <Card>
            <ListingImage listing={listing} alt={locale === "bn" ? listing.titleBn : listing.titleEn} sizes="(max-width: 1024px) 100vw, 60vw" />
            <CardHeader>
              <p className="text-sm font-medium text-primary">{locale === "bn" ? listing.category : listing.category}</p>
              <CardTitle className="text-3xl">{locale === "bn" ? listing.titleBn : listing.titleEn}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1"><UserRoundIcon className="size-4" aria-hidden="true" />{locale === "bn" ? listing.providerNameBn : listing.providerNameEn}</span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1"><MapPinIcon className="size-4" aria-hidden="true" />{listing.district}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{locale === "bn" ? listing.descriptionBn : listing.descriptionEn}</p>
              <div className="grid gap-3 rounded-xl bg-muted/60 p-4 sm:grid-cols-3">
                <div><p className="text-xs text-muted-foreground">{t.workflow.price}</p><p className="mt-1 font-semibold">{price(listing.unitPrice)} / {listing.unit}</p></div>
                <div><p className="text-xs text-muted-foreground">{t.workflow.stock}</p><p className="mt-1 inline-flex items-center gap-1 font-semibold"><PackageIcon aria-hidden="true" className="size-4" />{listing.stock} {listing.unit}</p></div>
                <div><p className="text-xs text-muted-foreground">{t.workflow.district}</p><p className="mt-1 font-semibold">{listing.district}</p></div>
              </div>
              <Link href={`${base}/providers/${listing.providerId}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit gap-2")}>
                {locale === "bn" ? "সেবাদাতার পরিচিতি" : "Provider profile"}<ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
            </CardContent>
          </Card>
        ) : null}
        <div className="flex gap-3">
          <Link href={base} className={buttonVariants({ variant: "outline" })}>{t.nav.browse}</Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>{locale === "bn" ? "সব বিভাগ" : "All sectors"}</Link>
        </div>
      </div>
      {listing && !unavailable && (
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl">{locale === "bn" ? "অনুরোধ পাঠান" : "Send a request"}</CardTitle>
            <CardDescription>{locale === "bn" ? "সেবাদাতা মূল্য ও শর্ত পাঠালে আপনি সিদ্ধান্ত নিতে পারবেন।" : "The provider will send terms for you to review before confirming."}</CardDescription>
          </CardHeader>
          <CardContent>
            {signedIn ? (
              <ListingRequestForm listing={listing} projectId={projectId} packageLabel={packageLabel} />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">{t.workflow.signInToRequest}</p>
                <Link href={`/login?next=${encodeURIComponent(returnTo)}`} className={cn(buttonVariants(), "w-full")}>{t.auth.signIn}</Link>
                <Link href={`/register?next=${encodeURIComponent(returnTo)}`} className={cn(buttonVariants({ variant: "outline" }), "w-full")}>{t.auth.createAccount}</Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {unavailable && <Button type="button" variant="outline" onClick={() => window.location.reload()} className="h-fit">{locale === "bn" ? "আবার চেষ্টা করুন" : "Try again"}</Button>}
    </div>
  );
}
