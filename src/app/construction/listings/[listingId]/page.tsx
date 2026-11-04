import type { Metadata } from "next";
import { ConstructionListingPage } from "@/components/construction/construction-listing-page";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ listingId: string }> }): Promise<Metadata> {
  const { listingId } = await params;
  return { title: "Construction listing | EKsathe Bangladesh", alternates: { canonical: `/construction/listings/${encodeURIComponent(listingId)}` } };
}

export default async function DirectListingPage({ params, searchParams }: {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { listingId } = await params;
  return <ConstructionListingPage listingId={listingId} routeBase="/construction" searchParams={searchParams} />;
}
