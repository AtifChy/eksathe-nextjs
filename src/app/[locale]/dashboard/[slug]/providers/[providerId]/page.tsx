import { notFound, permanentRedirect } from "next/navigation";
import { locale as rootLocale } from "next/root-params";

import { ProviderProfile } from "@/components/dashboard/provider-profile";
import { defaultLocale, isLocale, type Locale } from "@/i18n/locales";
import { localizedPath } from "@/i18n/paths";
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
  const [{ slug, providerId }, query, paramLocale] = await Promise.all([
    params,
    searchParams,
    rootLocale(),
  ]);
  const locale: Locale = isLocale(paramLocale) ? paramLocale : defaultLocale;
  const sector = getSector(slug);
  if (slug === "agriculture-labor") {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(query))
      for (const item of Array.isArray(value) ? value : value ? [value] : [])
        search.append(key, item);
    permanentRedirect(
      localizedPath(
        locale,
        `/dashboard/agriculture/providers/${encodeURIComponent(providerId)}${search.size ? `?${search.toString()}` : ""}`,
      ),
    );
  }
  if (!sector || sector.status !== "live") notFound();
  const result = await getPublicProviderProfile(slug, providerId);
  if (!result.provider && !result.unavailable) notFound();
  return (
    <ProviderProfile provider={result.provider} sector={sector} unavailable={result.unavailable} />
  );
}
