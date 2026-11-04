import { connection } from "next/server";
import { ConstructionHome } from "@/components/construction/construction-home";
import { getConstructionCommissionRate } from "@/lib/construction/public-data";
import { getPublicListings } from "@/lib/listings";

export const metadata = { alternates: { canonical: "/construction" } };
export const instant = false;

export default async function DashboardConstructionPage() {
  await connection();
  const [result, commissionRate] = await Promise.all([getPublicListings("construction"), getConstructionCommissionRate()]);
  return <ConstructionHome routeBase="/dashboard/construction" showDashboardBackLink listings={result.items} unavailable={result.unavailable} commissionRate={commissionRate} />;
}
