import type { Metadata } from "next";

import { ConstructionProviderPage } from "@/components/construction/construction-listing-page";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ providerId: string }>;
}): Promise<Metadata> {
  const { providerId } = await params;
  return { alternates: { canonical: `/construction/providers/${encodeURIComponent(providerId)}` } };
}

export default async function DashboardProviderPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  return <ConstructionProviderPage providerId={providerId} routeBase="/dashboard/construction" />;
}
