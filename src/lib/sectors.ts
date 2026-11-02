import type { DashboardCategory } from "@/dictionaries/types";

export type SectorDefinition = DashboardCategory & {
  status: "live" | "coming-soon";
};

export const sectors = [
  { id: 1, slug: "family-household", icon: "🏠", labelEn: "Family & Household", labelBn: "পরিবার ও গৃহস্থালি", status: "coming-soon" },
  { id: 2, slug: "ecommerce-b2b", icon: "🛒", labelEn: "E-Commerce & B2B", labelBn: "ই-কমার্স ও B2B", status: "coming-soon" },
  { id: 3, slug: "repair-services", icon: "🔧", labelEn: "Repair Services", labelBn: "মেরামত সেবা", status: "coming-soon" },
  { id: 4, slug: "agriculture-labor", icon: "🌾", labelEn: "Agriculture & Labor", labelBn: "কৃষি ও শ্রমিক", status: "live" },
  { id: 5, slug: "construction", icon: "🏗️", labelEn: "Construction", labelBn: "নির্মাণ", status: "live" },
  { id: 6, slug: "transport-bus", icon: "🚌", labelEn: "Transport & Bus Tickets", labelBn: "পরিবহন ও বাস টিকিট", status: "coming-soon" },
  { id: 7, slug: "tourism", icon: "🧳", labelEn: "Tourism", labelBn: "ট্যুরিজম", status: "coming-soon" },
  { id: 8, slug: "healthcare", icon: "🏥", labelEn: "Healthcare", labelBn: "স্বাস্থ্যসেবা", status: "coming-soon" },
  { id: 9, slug: "events", icon: "🎉", labelEn: "Events", labelBn: "ইভেন্ট", status: "coming-soon" },
  { id: 10, slug: "isp-utility", icon: "🌐", labelEn: "ISP & Utility", labelBn: "ISP ও ইউটিলিটি", status: "coming-soon" },
  { id: 11, slug: "jobs-professionals", icon: "💼", labelEn: "Jobs & Professionals", labelBn: "চাকরি ও পেশাজীবী", status: "coming-soon" },
  { id: 12, slug: "social-feed", icon: "💬", labelEn: "Social Feed", labelBn: "সামাজিক ফিড", status: "coming-soon" },
  { id: 13, slug: "payment-compliance", icon: "💳", labelEn: "Payment & Compliance", labelBn: "পেমেন্ট ও কমপ্লায়েন্স", status: "coming-soon" },
] as const satisfies readonly SectorDefinition[];

export type SectorSlug = (typeof sectors)[number]["slug"];

export function getSector(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}

export function isLiveSector(slug: string): slug is "agriculture-labor" | "construction" {
  return slug === "agriculture-labor" || slug === "construction";
}

export const agricultureListings = [
  { slug: "produce-market", titleEn: "Produce Marketplace", titleBn: "কৃষিপণ্যের বাজার", kind: "PRODUCE", icon: "🥬", unit: "kg" },
  { slug: "farm-labour", titleEn: "Farm Worker Booking", titleBn: "কৃষিশ্রমিক বুকিং", kind: "WORKER", icon: "👨‍🌾", unit: "day" },
  { slug: "farm-machinery", titleEn: "Farm Machinery Hire", titleBn: "কৃষিযন্ত্র ভাড়া", kind: "MACHINERY", icon: "🚜", unit: "day" },
] as const;

export const constructionListings = [
  { slug: "construction-material", titleEn: "Building Materials", titleBn: "নির্মাণসামগ্রী", kind: "CONSTRUCTION_MATERIAL", icon: "🧱", unit: "piece" },
  { slug: "construction-service", titleEn: "Construction Professionals", titleBn: "নির্মাণ পেশাজীবী", kind: "CONSTRUCTION_SERVICE", icon: "👷", unit: "job" },
] as const;

