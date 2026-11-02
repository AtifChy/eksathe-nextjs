import { permanentRedirect } from "next/navigation";

export default async function LegacyAgriculturePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const values = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) query.append(key, item);
  }
  permanentRedirect(`/dashboard/agriculture${query.size ? `?${query.toString()}` : ""}`);
}
