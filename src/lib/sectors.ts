export interface DashboardCategory {
  id: number;
  slug: string;
  icon: string;
  status: "live" | "coming-soon";
}

export type SectorDefinition = DashboardCategory;

export const sectors = [
  {
    id: 1,
    slug: "family-household",
    icon: "🏠",
    status: "coming-soon",
  },
  {
    id: 2,
    slug: "ecommerce-b2b",
    icon: "🛒",
    status: "live",
  },
  {
    id: 3,
    slug: "repair-services",
    icon: "🔧",
    status: "coming-soon",
  },
  {
    id: 4,
    slug: "agriculture-labor",
    icon: "🌾",
    status: "live",
  },
  {
    id: 5,
    slug: "construction",
    icon: "🏗️",
    status: "live",
  },
  {
    id: 6,
    slug: "transport-bus",
    icon: "🚌",
    status: "coming-soon",
  },
  {
    id: 7,
    slug: "tourism",
    icon: "🧳",
    status: "coming-soon",
  },
  {
    id: 8,
    slug: "healthcare",
    icon: "🏥",
    status: "coming-soon",
  },
  { id: 9, slug: "events", icon: "🎉", status: "coming-soon" },
  {
    id: 10,
    slug: "isp-utility",
    icon: "🌐",
    status: "coming-soon",
  },
  {
    id: 11,
    slug: "jobs-professionals",
    icon: "💼",
    status: "coming-soon",
  },
  {
    id: 12,
    slug: "social-feed",
    icon: "💬",
    status: "coming-soon",
  },
  {
    id: 13,
    slug: "payment-compliance",
    icon: "💳",
    status: "coming-soon",
  },
] as const satisfies readonly SectorDefinition[];

export type SectorSlug = (typeof sectors)[number]["slug"];

export function getSector(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}

export function isLiveSector(slug: string): slug is "agriculture-labor" | "construction" {
  return slug === "agriculture-labor" || slug === "construction";
}

export const agricultureListings = [
  {
    slug: "produce-market",
    titleEn: "Produce Marketplace",
    titleBn: "কৃষিপণ্যের বাজার",
    kind: "PRODUCE",
    icon: "🥬",
    unit: "kg",
  },
  {
    slug: "farm-labour",
    titleEn: "Farm Worker Booking",
    titleBn: "কৃষিশ্রমিক বুকিং",
    kind: "WORKER",
    icon: "👨‍🌾",
    unit: "day",
  },
  {
    slug: "farm-machinery",
    titleEn: "Farm Machinery Hire",
    titleBn: "কৃষিযন্ত্র ভাড়া",
    kind: "MACHINERY",
    icon: "🚜",
    unit: "day",
  },
] as const;

export const constructionListings = [
  {
    slug: "construction-material",
    titleEn: "Building Materials",
    titleBn: "নির্মাণসামগ্রী",
    kind: "CONSTRUCTION_MATERIAL",
    icon: "🧱",
    unit: "piece",
  },
  {
    slug: "construction-service",
    titleEn: "Construction Professionals",
    titleBn: "নির্মাণ পেশাজীবী",
    kind: "CONSTRUCTION_SERVICE",
    icon: "👷",
    unit: "job",
  },
] as const;
