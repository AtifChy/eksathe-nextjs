import { notFound } from "next/navigation";
import { ProviderProfile } from "@/components/dashboard/provider-profile";
import { getPublicProviderProfile } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function DashboardAgricultureProviderPage({ params }: { params: Promise<{ providerId: string }> }) {
  const { providerId } = await params;
  const sector = getSector("agriculture-labor");
  if (!sector) notFound();
  const result = await getPublicProviderProfile(sector.slug, providerId);
  if (!result.provider && !result.unavailable) notFound();
  return <ProviderProfile provider={result.provider} sector={sector} unavailable={result.unavailable} routeBase="/dashboard/agriculture" />;
}
