import { AgricultureHome } from "@/components/agriculture/agriculture-home";
import { getPublicListings } from "@/lib/listings";

export const metadata = { alternates: { canonical: "/agriculture" } };

export default async function DashboardAgriculturePage() {
  const result = await getPublicListings("agriculture-labor");
  return <AgricultureHome routeBase="/dashboard/agriculture" showDashboardBackLink listings={result.items} unavailable={result.unavailable} />;
}
