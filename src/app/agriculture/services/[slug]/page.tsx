import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AgricultureServiceDetail } from "@/components/agriculture/agriculture-service-detail";
import { agricultureServiceRegistry } from "@/lib/agriculture/service-registry";
import { getCurrentUser } from "@/lib/dal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = agricultureServiceRegistry.find((item) => item.slug === slug);
  if (!service) notFound();
  return {
    title: `${service.titleEn} | EKsathe Bangladesh`,
    alternates: { canonical: `/agriculture/services/${service.slug}` },
  };
}

export default async function AgricultureServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = agricultureServiceRegistry.find((item) => item.slug === slug);
  if (!service) notFound();
  const user = await getCurrentUser();
  const customer = user?.status === "active" ? { name: user.name, phone: user.phone } : null;
  return (
    <AgricultureServiceDetail
      service={service}
      routeBase="/agriculture"
      customer={customer}
      emailVerified={Boolean(user?.emailVerified)}
    />
  );
}
