"use client";

import { cn } from "cn";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  PackageIcon,
  StarIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

import { ListingImage } from "@/components/dashboard/listing-image";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListingRequestForm } from "@/components/workflows/listing-request-form";
import type { PublicListing, PublicProvider } from "@/lib/listings";
import type { SectorDefinition } from "@/lib/sectors";

export function ListingDetail({
  sector,
  listing,
  provider,
  unavailable,
  signedIn,
  projectId,
  packageId,
  packageLabel,
  routeBase,
}: {
  sector: SectorDefinition;
  listing: PublicListing | null;
  provider?: PublicProvider | null;
  unavailable: boolean;
  signedIn: boolean;
  projectId?: string;
  packageId?: string;
  packageLabel?: string;
  routeBase?: string;
}) {
  const { locale, t } = useLanguage();
  const price = (value: string) =>
    new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 2,
    }).format(Number(value));
  const base = routeBase ?? `/dashboard/${sector.slug}`;
  const scheduled = listing
    ? ["WORKER", "MACHINERY", "CONSTRUCTION_SERVICE"].includes(listing.kind)
    : false;
  const projectRequest = Boolean(projectId && packageId);
  const returnTo = `${base}/listings/${listing?.id ?? ""}${projectRequest ? `?${new URLSearchParams({ projectId: projectId!, packageId: packageId! }).toString()}` : ""}`;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
      <div className="flex flex-col gap-6">
        <Link
          href={base}
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-2 text-sm"
        >
          <ArrowLeftIcon aria-hidden="true" className="size-4" />
          {locale === "bn" ? "সব সেবা" : "All services"}
        </Link>
        {unavailable ? (
          <p
            role="alert"
            className="border-destructive/30 bg-destructive/5 text-destructive rounded-2xl border p-6 text-sm"
          >
            {t.workflow.dataUnavailable}
          </p>
        ) : listing ? (
          <Card>
            <ListingImage
              listing={listing}
              alt={locale === "bn" ? listing.titleBn : listing.titleEn}
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <CardHeader>
              <p className="text-primary text-sm font-medium">
                {locale === "bn" ? listing.category : listing.category}
              </p>
              <CardTitle className="text-3xl">
                {locale === "bn" ? listing.titleBn : listing.titleEn}
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1">
                  <UserRoundIcon className="size-4" aria-hidden="true" />
                  {locale === "bn" ? listing.providerNameBn : listing.providerNameEn}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <MapPinIcon className="size-4" aria-hidden="true" />
                  {listing.district}
                </span>
              </CardDescription>
              {listing.averageRating !== null && (
                <p className="inline-flex items-center gap-1 text-sm font-medium">
                  <StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />
                  {listing.averageRating.toFixed(1)} · {listing.reviewCount}{" "}
                  {locale === "bn" ? "টি পর্যালোচনা" : "reviews"}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <p className="text-muted-foreground text-sm leading-7 whitespace-pre-line">
                {locale === "bn" ? listing.descriptionBn : listing.descriptionEn}
              </p>
              <div className="bg-muted/60 grid gap-3 rounded-xl p-4 sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground text-xs">{t.workflow.price}</p>
                  <p className="mt-1 font-semibold">
                    {price(listing.unitPrice)} / {listing.unit}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">
                    {scheduled
                      ? locale === "bn"
                        ? "বুকিংয়ের উপলভ্যতা"
                        : "Booking availability"
                      : t.workflow.stock}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 font-semibold">
                    <PackageIcon aria-hidden="true" className="size-4" />
                    {scheduled
                      ? listing.availableFrom
                        ? `${locale === "bn" ? "শুরু" : "From"} ${new Date(listing.availableFrom).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD")}`
                        : locale === "bn"
                          ? "তারিখ অনুযায়ী যাচাই হবে"
                          : "Checked for requested dates"
                      : `${listing.stock} ${listing.unit}`}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">{t.workflow.district}</p>
                  <p className="mt-1 font-semibold">{listing.district}</p>
                </div>
              </div>
              <Link
                href={`${base}/providers/${listing.providerId}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit gap-2")}
              >
                {locale === "bn" ? "সেবাদাতার পরিচিতি" : "Provider profile"}
                <ArrowRightIcon aria-hidden="true" className="size-4" />
              </Link>
              {sector.slug === "construction" && (
                <Link
                  href={`/account/projects/new?listing=${encodeURIComponent(listing.id)}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-fit gap-2")}
                >
                  {locale === "bn"
                    ? "এই সেবা দিয়ে প্রকল্প তৈরি করুন"
                    : "Create a project with this listing"}
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
              )}
            </CardContent>
          </Card>
        ) : null}
        {listing && !unavailable && provider && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{locale === "bn" ? "বিক্রেতা" : "Seller"}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-2">
                  {locale === "bn" ? provider.nameBn : provider.nameEn} · {provider.district}
                  {provider.averageRating !== null && (
                    <span className="inline-flex items-center gap-1">
                      <StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />
                      {provider.averageRating.toFixed(1)} ({provider.reviewCount})
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-3">
                <p className="text-muted-foreground max-w-2xl text-sm">
                  {locale === "bn" ? provider.bioBn : provider.bioEn}
                </p>
                <Link
                  href={`${base}/providers/${provider.id}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2")}
                >
                  {locale === "bn" ? "দোকান দেখুন" : "Visit storefront"}
                  <ArrowRightIcon aria-hidden="true" className="size-4" />
                </Link>
              </CardContent>
            </Card>
            {provider.listings.filter((item) => item.id !== listing.id).length > 0 && (
              <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">
                  {locale === "bn" ? "এই বিক্রেতার আরও পণ্য" : "More from this seller"}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {provider.listings
                    .filter((item) => item.id !== listing.id)
                    .slice(0, 4)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`${base}/listings/${item.id}`}
                        className="border-border/70 hover:border-primary/40 rounded-xl border p-4"
                      >
                        <p className="font-semibold">
                          {locale === "bn" ? item.titleBn : item.titleEn}
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {item.category} · {item.unitPrice} BDT / {item.unit}
                        </p>
                      </Link>
                    ))}
                </div>
              </section>
            )}
          </>
        )}
        {listing && !unavailable && listing.reviews && listing.reviews.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold">
              {locale === "bn" ? "ক্রেতার পর্যালোচনা" : "Customer reviews"}
            </h2>
            {listing.reviews.map((review, index) => (
              <Card key={`${review.createdAt}-${index}`}>
                <CardContent className="flex flex-col gap-2 p-4">
                  <p className="inline-flex items-center gap-1 text-sm font-semibold">
                    <StarIcon aria-hidden="true" className="size-4 fill-current text-amber-500" />
                    {review.rating} / 5
                  </p>
                  <p className="text-muted-foreground text-sm whitespace-pre-line">
                    {review.comment}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(review.createdAt).toLocaleDateString(
                      locale === "bn" ? "bn-BD" : "en-BD",
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
        <div className="flex gap-3">
          <Link href={base} className={buttonVariants({ variant: "outline" })}>
            {t.nav.browse}
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "ghost" })}>
            {locale === "bn" ? "সব বিভাগ" : "All sectors"}
          </Link>
        </div>
      </div>
      {listing && !unavailable && (
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-xl">
              {locale === "bn" ? "অনুরোধ পাঠান" : "Send a request"}
            </CardTitle>
            <CardDescription>
              {locale === "bn"
                ? "সেবাদাতা মূল্য ও শর্ত পাঠালে আপনি সিদ্ধান্ত নিতে পারবেন।"
                : "The provider will send terms for you to review before confirming."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {signedIn ? (
              <ListingRequestForm
                listing={listing}
                routeBase={base}
                projectId={projectRequest ? projectId : undefined}
                packageId={projectRequest ? packageId : undefined}
                packageLabel={projectRequest ? packageLabel : undefined}
              />
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-muted-foreground text-sm">{t.workflow.signInToRequest}</p>
                <Link
                  href={`/login?next=${encodeURIComponent(returnTo)}`}
                  className={cn(buttonVariants(), "w-full")}
                >
                  {t.auth.signIn}
                </Link>
                <Link
                  href={`/register?next=${encodeURIComponent(returnTo)}`}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                >
                  {t.auth.createAccount}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      {unavailable && (
        <Button
          type="button"
          variant="outline"
          onClick={() => window.location.reload()}
          className="h-fit"
        >
          {locale === "bn" ? "আবার চেষ্টা করুন" : "Try again"}
        </Button>
      )}
    </div>
  );
}
