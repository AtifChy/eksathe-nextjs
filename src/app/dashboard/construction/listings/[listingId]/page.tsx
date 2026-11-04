import type { Metadata } from "next";

import { ConstructionListingPage } from "@/components/construction/construction-listing-page";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ listingId: string }>;
}): Promise<Metadata> {
  const { listingId } = await params;
  return { alternates: { canonical: `/construction/listings/${encodeURIComponent(listingId)}` } };
}

export default async function DashboardListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { listingId } = await params;
  return (
    <ConstructionListingPage
      listingId={listingId}
      routeBase="/dashboard/construction"
      searchParams={searchParams}
    />
  );
}
