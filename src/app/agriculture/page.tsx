import { connection } from "next/server";

import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getActiveAgricultureServiceCatalog } from "@/lib/agriculture/admin";
import { getPageMetadata } from "@/i18n/metadata";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";
import { getPublicListings } from "@/lib/listings";

export function generateMetadata() {
  return getPageMetadata("agriculture", "/agriculture");
}
export const instant = false;

export default async function AgriculturePage() {
  await connection();
  const [result, publicInfo, serviceCatalog] = await Promise.all([
    getPublicListings("agriculture-labor"),
    getAgriculturePublicInfo(),
    getActiveAgricultureServiceCatalog(),
  ]);
  return (
    <AgricultureHome
      routeBase="/agriculture"
      showDashboardBackLink={false}
      listings={result.items}
      unavailable={result.unavailable}
      publicInfo={publicInfo}
      serviceCatalog={serviceCatalog}
    />
  );
}
