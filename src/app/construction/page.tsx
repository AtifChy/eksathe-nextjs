import { connection } from "next/server";

import { ConstructionHome } from "@/components/construction/construction-home";
import { getPageMetadata } from "@/i18n/metadata";
import { getConstructionCommissionRate } from "@/lib/construction/public-data";
import { getPublicListings } from "@/lib/listings";

export function generateMetadata() {
  return getPageMetadata("construction", "/construction");
}
export const instant = false;

export default async function ConstructionPage() {
  await connection();
  const [result, commissionRate] = await Promise.all([
    getPublicListings("construction"),
    getConstructionCommissionRate(),
  ]);
  return (
    <ConstructionHome
      routeBase="/construction"
      showDashboardBackLink={false}
      listings={result.items}
      unavailable={result.unavailable}
      commissionRate={commissionRate}
    />
  );
}
