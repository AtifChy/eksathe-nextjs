import { notFound } from "next/navigation";
import { ProviderProfile } from "@/components/dashboard/provider-profile";
import { getPublicProviderProfile } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function PublicProviderPage({ params }: { params: Promise<{ slug: string; providerId: string }> }) {
  const { slug, providerId } = await params;
  const sector = getSector(slug);
  if (!sector || sector.status !== "live") notFound();
  const result = await getPublicProviderProfile(slug, providerId);
  if (!result.provider && !result.unavailable) notFound();
  return <ProviderProfile provider={result.provider} sector={sector} unavailable={result.unavailable} />;
}
