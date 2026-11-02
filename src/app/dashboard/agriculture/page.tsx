import { connection } from "next/server";
import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getPublicListings } from "@/lib/listings";
import { getAgriculturePublicInfo } from "@/lib/agriculture/publishing";

export const metadata = { alternates: { canonical: "/agriculture" } };
export const instant = false;

export default async function DashboardAgriculturePage() {
  await connection();
  const [result, publicInfo] = await Promise.all([getPublicListings("agriculture-labor"), getAgriculturePublicInfo()]);
  return <AgricultureHome routeBase="/dashboard/agriculture" showDashboardBackLink listings={result.items} unavailable={result.unavailable} publicInfo={publicInfo} />;
}
