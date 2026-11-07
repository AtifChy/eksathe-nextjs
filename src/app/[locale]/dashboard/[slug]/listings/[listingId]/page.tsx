import { notFound, permanentRedirect } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

import { ListingDetail } from "@/components/dashboard/listing-detail";
import { defaultLocale, isLocale, type Locale } from "@/i18n/locales";
import { localizedPath } from "@/i18n/paths";
import { getCurrentUser } from "@/lib/dal";
import { getPublicListing, getPublicProviderProfile } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; listingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug, listingId }, query, paramLocale] = await Promise.all([
    params,
    searchParams,
    rootLocale(),
  ]);
  const locale: Locale = isLocale(paramLocale) ? paramLocale : defaultLocale;
  const sector = getSector(slug);
  if (slug === "agriculture-labor") {
    const queryString = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      for (const item of Array.isArray(value) ? value : value ? [value] : [])
        queryString.append(key, item);
    }
    permanentRedirect(
      localizedPath(
        locale,
        `/dashboard/agriculture/listings/${encodeURIComponent(listingId)}${queryString.size ? `?${queryString.toString()}` : ""}`,
      ),
    );
  }
  if (!sector || sector.status !== "live") notFound();

  const [result, user] = await Promise.all([getPublicListing(listingId), getCurrentUser()]);
  if (result.listing && result.listing.sectorSlug !== slug) notFound();
  if (!result.listing && !result.unavailable) notFound();
  const providerResult = result.listing
    ? await getPublicProviderProfile(sector.slug, result.listing.providerId)
    : null;

  return (
    <ListingDetail
      sector={sector}
      listing={result.listing}
      provider={providerResult?.provider}
      unavailable={result.unavailable}
      signedIn={Boolean(user && user.status === "active")}
      projectId={
        typeof query.projectId === "string" && query.projectId.length <= 64
          ? query.projectId
          : undefined
      }
      packageLabel={
        typeof query.packageLabel === "string" && query.packageLabel.length <= 80
          ? query.packageLabel
          : undefined
      }
    />
  );
}
