import { notFound } from "next/navigation";
import { ListingDetail } from "@/components/dashboard/listing-detail";
import { getCurrentUser } from "@/lib/dal";
import { getPublicListing } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function ListingPage({ params, searchParams }: {
  params: Promise<{ slug: string; listingId: string }>;
  searchParams: Promise<{ projectId?: string | string[] }>;
}) {
  const { slug, listingId } = await params;
  const query = await searchParams;
  const sector = getSector(slug);
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
    />
  );
}
