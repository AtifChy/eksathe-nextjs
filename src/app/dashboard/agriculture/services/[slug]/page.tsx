import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations();
  return {
    title: `${t(`agricultureServices.${service.slug}.title` as never)} | ${t("common.brandName")}`,
    alternates: { canonical: `/agriculture/services/${service.slug}` },
  };
}

export default async function DashboardAgricultureServicePage({
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
      routeBase="/dashboard/agriculture"
      customer={customer}
      emailVerified={Boolean(user?.emailVerified)}
    />
  );
}
