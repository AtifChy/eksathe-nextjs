import { notFound } from "next/navigation";
import { permanentRedirect } from "next/navigation";

import { ProviderProfile } from "@/components/dashboard/provider-profile";
import { getPublicProviderProfile } from "@/lib/listings";
import { getSector } from "@/lib/sectors";

export const instant = false;

export default async function PublicProviderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; providerId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug, providerId }, query] = await Promise.all([params, searchParams]);
  const sector = getSector(slug);
  if (slug === "agriculture-labor") {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      for (const item of Array.isArray(value) ? value : value ? [value] : [])
        search.append(key, item);
    permanentRedirect(
      `/dashboard/agriculture/providers/${encodeURIComponent(providerId)}${search.size ? `?${search.toString()}` : ""}`,
    );
  }
  if (!sector || sector.status !== "live") notFound();
  const result = await getPublicProviderProfile(slug, providerId);
  if (!result.provider && !result.unavailable) notFound();
  return (
    <ProviderProfile provider={result.provider} sector={sector} unavailable={result.unavailable} />
  );
}
