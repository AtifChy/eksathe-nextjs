import type { Metadata } from "next";

import { localizedCanonical } from "@/i18n/metadata";

import { ConstructionProviderPage } from "@/components/construction/construction-listing-page";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ providerId: string }>;
}): Promise<Metadata> {
  const { providerId } = await params;
  return {
    title: "Construction provider | EKsathe Bangladesh",
    alternates: { canonical: await localizedCanonical(`/construction/providers/${encodeURIComponent(providerId)}`) },
  };
}

export default async function DirectProviderPage({
  params,
}: {
  params: Promise<{ providerId: string }>;
}) {
  const { providerId } = await params;
  return <ConstructionProviderPage providerId={providerId} routeBase="/construction" />;
}
