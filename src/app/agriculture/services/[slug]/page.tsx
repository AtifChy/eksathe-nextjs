import { notFound } from "next/navigation";
import { AgricultureServiceDetail } from "@/components/agriculture/agriculture-service-detail";
import { agricultureServiceRegistry } from "@/lib/agriculture/service-registry";

export default async function AgricultureServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = agricultureServiceRegistry.find((item) => item.slug === slug);
  if (!service) notFound();
  return <AgricultureServiceDetail service={service} routeBase="/agriculture" />;
}
