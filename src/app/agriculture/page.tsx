import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getPageMetadata } from "@/i18n/metadata";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";
import { getPublicListings } from "@/lib/listings";

export function generateMetadata() {
  return getPageMetadata("agriculture", "/agriculture");
}
export const instant = false;

export default async function AgriculturePage() {
  const [result, publicInfo] = await Promise.all([
    getPublicListings("agriculture-labor"),
    getAgriculturePublicInfo(),
  ]);
  return (
    <AgricultureHome
      routeBase="/agriculture"
      showDashboardBackLink={false}
      listings={result.items}
      unavailable={result.unavailable}
      publicInfo={publicInfo}
    />
  );
}
