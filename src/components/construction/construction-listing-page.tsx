import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ListingDetail } from "@/components/dashboard/listing-detail";
import { ProviderProfile } from "@/components/dashboard/provider-profile";
import { getCurrentUser } from "@/lib/dal";
import { getPublicListing, getPublicProviderProfile } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export async function ConstructionListingPage({ listingId, routeBase, searchParams }: {
  listingId: string;
  routeBase: string;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  await connection();
  const query = await searchParams;
  const sector = getSector("construction");
  if (!sector || sector.status !== "live") notFound();
  const [result, user] = await Promise.all([getPublicListing(listingId), getCurrentUser()]);
  if (result.listing && result.listing.sectorSlug !== "construction") notFound();
  if (!result.listing && !result.unavailable) notFound();
  const providerResult = result.listing ? await getPublicProviderProfile("construction", result.listing.providerId) : null;
  const projectId = typeof query?.projectId === "string" && query.projectId.length <= 64 ? query.projectId : undefined;
  const packageLabel = typeof query?.packageLabel === "string" && query.packageLabel.length <= 80 ? query.packageLabel : undefined;

  return <ListingDetail sector={sector} routeBase={routeBase} listing={result.listing} provider={providerResult?.provider} unavailable={result.unavailable} signedIn={Boolean(user && user.status === "active")} projectId={projectId} packageLabel={packageLabel} />;
}

export async function ConstructionProviderPage({ providerId, routeBase }: { providerId: string; routeBase: string }) {
  await connection();
  const sector = getSector("construction");
  if (!sector || sector.status !== "live") notFound();
  const result = await getPublicProviderProfile("construction", providerId);
  if (!result.provider && !result.unavailable) notFound();
  return <ProviderProfile provider={result.provider} sector={sector} unavailable={result.unavailable} routeBase={routeBase} />;
}
