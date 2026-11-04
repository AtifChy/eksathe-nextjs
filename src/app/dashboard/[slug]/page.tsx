import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectorLanding } from "@/components/dashboard/sector-landing";
import { getPublicListings } from "@/lib/listings";
import { getSector, agricultureListings, constructionListings } from "@/lib/sectors";

export const instant = false;

type SectorPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();
  return { title: `${sector.labelEn} | EKsathe Bangladesh` };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  if (sector.status !== "live") {
    return <SectorLanding sector={sector} listings={[]} services={[]} />;
  }

  const isAgriculture = slug === "agriculture-labor";
  const services = isAgriculture ? agricultureListings : constructionListings;
  const listingResult = await getPublicListings(slug);
  return (
    <SectorLanding
      sector={sector}
      listings={listingResult.items}
      unavailable={listingResult.unavailable}
      services={[...services]}
    />
  );
}
