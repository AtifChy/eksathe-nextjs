import { cacheLife } from "next/cache";
import { FooterContent } from "@/components/footer-content";

async function getCurrentYear() {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await getCurrentYear();

  return <FooterContent year={year} />;
}
