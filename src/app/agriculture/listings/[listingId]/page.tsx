import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/dashboard/listing-detail";
import { getCurrentUser } from "@/lib/dal";
import { getPublicListing } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function AgricultureListingPage({ params, searchParams }: {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{ projectId?: string | string[]; packageLabel?: string | string[] }>;
}) {
  const [{ listingId }, query] = await Promise.all([params, searchParams]);
  const sector = getSector("agriculture-labor");
  if (!sector) notFound();
  const [result, user] = await Promise.all([getPublicListing(listingId), getCurrentUser()]);
  if (result.listing && result.listing.sectorSlug !== sector.slug) notFound();
  if (!result.listing && !result.unavailable) notFound();
  return <ListingDetail sector={sector} routeBase="/agriculture" listing={result.listing} unavailable={result.unavailable} signedIn={Boolean(user && user.status === "active")} projectId={typeof query.projectId === "string" && query.projectId.length <= 64 ? query.projectId : undefined} packageLabel={typeof query.packageLabel === "string" && query.packageLabel.length <= 80 ? query.packageLabel : undefined} />;
}
