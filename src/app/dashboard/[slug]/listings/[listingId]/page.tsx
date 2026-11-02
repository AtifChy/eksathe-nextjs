import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";
import { ListingDetail } from "@/components/dashboard/listing-detail";
import { getCurrentUser } from "@/lib/dal";
import { getPublicListing } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function ListingPage({ params, searchParams }: {
  params: Promise<{ slug: string; listingId: string }>;
  searchParams: Promise<{ projectId?: string | string[]; packageLabel?: string | string[] }>;
}) {
  const { slug, listingId } = await params;
  const query = await searchParams;
  const sector = getSector(slug);
  if (slug === "agriculture-labor") {
    const queryString = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      for (const item of Array.isArray(value) ? value : value ? [value] : []) queryString.append(key, item);
    }
    permanentRedirect(`/dashboard/agriculture/listings/${encodeURIComponent(listingId)}${queryString.size ? `?${queryString.toString()}` : ""}`);
  }
  if (!sector || sector.status !== "live") notFound();

  const [result, user] = await Promise.all([getPublicListing(listingId), getCurrentUser()]);
  if (result.listing && result.listing.sectorSlug !== slug) notFound();
  if (!result.listing && !result.unavailable) notFound();

  return (
    <ListingDetail
      sector={sector}
      listing={result.listing}
      unavailable={result.unavailable}
      signedIn={Boolean(user && user.status === "active")}
      projectId={typeof query.projectId === "string" && query.projectId.length <= 64 ? query.projectId : undefined}
      packageLabel={typeof query.packageLabel === "string" && query.packageLabel.length <= 80 ? query.packageLabel : undefined}
    />
  );
}
