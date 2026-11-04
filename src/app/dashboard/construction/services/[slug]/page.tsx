import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConstructionServicePage } from "@/components/construction/construction-service-page";
import { getConstructionService } from "@/lib/construction/service-registry";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (!getConstructionService(slug)) notFound();
  return { alternates: { canonical: `/construction/services/${slug}` } };
}

export default async function DashboardServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ConstructionServicePage slug={slug} routeBase="/dashboard/construction" />;
}
