export type ConstructionService = {
  slug: string;
  group: "professionals" | "trades" | "materials";
  kind: "CONSTRUCTION_SERVICE" | "CONSTRUCTION_MATERIAL";
  icon: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  searchTerms: string[];
};

export const constructionServiceCategories = [
  { id: "professionals", labelEn: "Design & professionals", labelBn: "পরিকল্পনা ও পেশাজীবী" },
  { id: "trades", labelEn: "Building trades", labelBn: "নির্মাণকাজ" },
  { id: "materials", labelEn: "Materials", labelBn: "নির্মাণসামগ্রী" },
] as const;

export const constructionServiceRegistry = [
  {
    slug: "contractors", group: "professionals", kind: "CONSTRUCTION_SERVICE", icon: "👷",
    titleEn: "Contractors & builders", titleBn: "ঠিকাদার ও নির্মাতা",
    descriptionEn: "Find approved construction teams for new builds, renovation, and defined work packages.",
    descriptionBn: "নতুন ভবন, সংস্কার ও নির্দিষ্ট নির্মাণকাজের জন্য অনুমোদিত নির্মাণ দল খুঁজুন।",
    searchTerms: ["contractor", "builder", "ঠিকাদার", "নির্মাতা"],
  },
  {
    slug: "engineers", group: "professionals", kind: "CONSTRUCTION_SERVICE", icon: "📐",
    titleEn: "Engineers", titleBn: "প্রকৌশলী",
    descriptionEn: "Browse construction engineering services and invite professionals to quote on your project.",
    descriptionBn: "নির্মাণ প্রকৌশল সেবা দেখুন এবং আপনার প্রকল্পের জন্য পেশাজীবীদের দরপ্রস্তাবে আমন্ত্রণ জানান।",
    searchTerms: ["engineer", "engineering", "প্রকৌশলী", "ইঞ্জিনিয়ার"],
  },
  {
    slug: "architects", group: "professionals", kind: "CONSTRUCTION_SERVICE", icon: "🏛️",
    titleEn: "Architects & designers", titleBn: "স্থপতি ও নকশাবিদ",
    descriptionEn: "Find design support for homes, shops, and other building projects.",
    descriptionBn: "বাড়ি, দোকান ও অন্যান্য ভবন প্রকল্পের নকশা সহায়তা খুঁজুন।",
    searchTerms: ["architect", "design", "স্থপতি", "নকশা"],
  },
  {
    slug: "masonry", group: "trades", kind: "CONSTRUCTION_SERVICE", icon: "🧱",
    titleEn: "Masonry & concrete", titleBn: "রাজমিস্ত্রি ও কংক্রিটের কাজ",
    descriptionEn: "Connect with approved masons for brickwork, plaster, and concrete work.",
    descriptionBn: "ইটের কাজ, প্লাস্টার ও কংক্রিটের কাজে অনুমোদিত রাজমিস্ত্রিদের সঙ্গে যুক্ত হন।",
    searchTerms: ["mason", "masonry", "brick", "concrete", "রাজমিস্ত্রি", "ইট"],
  },
  {
    slug: "electrical", group: "trades", kind: "CONSTRUCTION_SERVICE", icon: "⚡",
    titleEn: "Electrical work", titleBn: "বৈদ্যুতিক কাজ",
    descriptionEn: "Find electricians for wiring, installation, and construction fit-outs.",
    descriptionBn: "ওয়্যারিং, স্থাপন ও ভবনের বৈদ্যুতিক কাজের জন্য ইলেকট্রিশিয়ান খুঁজুন।",
    searchTerms: ["electric", "electrical", "wiring", "ইলেকট্রিক", "বৈদ্যুতিক"],
  },
  {
    slug: "plumbing", group: "trades", kind: "CONSTRUCTION_SERVICE", icon: "🚰",
    titleEn: "Plumbing & water systems", titleBn: "প্লাম্বিং ও পানির ব্যবস্থা",
    descriptionEn: "Browse plumbing and water-system installation or repair services.",
    descriptionBn: "প্লাম্বিং, পানির লাইন স্থাপন ও মেরামতের সেবা দেখুন।",
    searchTerms: ["plumb", "water", "প্লাম্ব", "পানির লাইন"],
  },
  {
    slug: "painting-finishing", group: "trades", kind: "CONSTRUCTION_SERVICE", icon: "🖌️",
    titleEn: "Painting & finishing", titleBn: "রং ও ফিনিশিং",
    descriptionEn: "Compare painting, tile, and finishing services for construction and renovation.",
    descriptionBn: "নির্মাণ ও সংস্কারকাজের রং, টাইলস ও ফিনিশিং সেবার দরপ্রস্তাব তুলনা করুন।",
    searchTerms: ["paint", "finishing", "tile", "রং", "ফিনিশিং", "টাইলস"],
  },
  {
    slug: "building-materials", group: "materials", kind: "CONSTRUCTION_MATERIAL", icon: "🧱",
    titleEn: "Building materials", titleBn: "নির্মাণসামগ্রী",
    descriptionEn: "Browse approved suppliers of construction materials and invite them to quote for a project package.",
    descriptionBn: "অনুমোদিত নির্মাণসামগ্রী সরবরাহকারী দেখুন এবং প্রকল্পের প্রয়োজন অনুযায়ী দরপ্রস্তাব নিন।",
    searchTerms: ["material", "materials", "supply", "সামগ্রী", "সরবরাহ"],
  },
] as const satisfies readonly ConstructionService[];

export function getConstructionService(slug: string) {
  return constructionServiceRegistry.find((service) => service.slug === slug);
}
