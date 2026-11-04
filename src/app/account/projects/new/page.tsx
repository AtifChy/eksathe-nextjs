import { CreateProjectEntry } from "@/components/projects/create-project-entry";
import { requireUser } from "@/lib/dal";
import { getPublicListing } from "@/lib/listings";
import { getConstructionService } from "@/lib/construction/service-registry";

export const instant = false;

export default async function CreateProjectPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const serviceSlug = typeof query.service === "string" && getConstructionService(query.service) ? query.service : undefined;
  const listingId = typeof query.listing === "string" && query.listing.length <= 64 ? query.listing : undefined;
  const intent = new URLSearchParams();
  if (listingId) intent.set("listing", listingId);
  else if (serviceSlug) intent.set("service", serviceSlug);
  await requireUser(`/account/projects/new${intent.size ? `?${intent.toString()}` : ""}`);

  const service = serviceSlug ? getConstructionService(serviceSlug) : undefined;
  const listingResult = listingId ? await getPublicListing(listingId) : null;
  const listing = listingResult?.listing?.sectorSlug === "construction" ? listingResult.listing : null;
  return <CreateProjectEntry context={{ ...(service && !listing ? { serviceSlug: service.slug, labelBn: service.titleBn, labelEn: service.titleEn } : {}), ...(listing ? { listingId: listing.id, labelBn: listing.titleBn, labelEn: listing.titleEn } : {}) }} />;
}
