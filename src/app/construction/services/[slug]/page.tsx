import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConstructionServicePage } from "@/components/construction/construction-service-page";
import { getConstructionService } from "@/lib/construction/service-registry";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getConstructionService(slug);
  if (!service) notFound();
  return { title: `${service.titleEn} | Construction | EKsathe Bangladesh`, alternates: { canonical: `/construction/services/${slug}` } };
}

export default async function DirectServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ConstructionServicePage slug={slug} routeBase="/construction" />;
}
