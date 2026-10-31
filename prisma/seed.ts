import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const panels = [
  {
    "slug": "crop-farming",
    "titleBn": "ফসল উৎপাদন ও চাষাবাদ",
    "titleEn": "Crop Farming",
    "category": "কৃষি",
    "descriptionBn": "ফসল, জমি, মৌসুমি চাষ, উৎপাদন পরিকল্পনা ও কৃষি পরামর্শের অনুরোধ।",
    "descriptionEn": "Crop, land, seasonal cultivation, production planning and farming advice.",
    "icon": "🌾"
  },
  {
    "slug": "seeds-seedlings",
    "titleBn": "বীজ ও চারা",
    "titleEn": "Seeds & Seedlings",
    "category": "কৃষি",
    "descriptionBn": "বীজ, চারা, জাত, সরবরাহকারী ও প্রাপ্যতার তথ্য।",
    "descriptionEn": "Seeds, seedlings, varieties, suppliers and availability.",
    "icon": "🌱"
  },
  {
    "slug": "fertilizer-soil",
    "titleBn": "সার ও মাটি পরীক্ষা",
    "titleEn": "Fertilizer & Soil Testing",
    "category": "কৃষি",
    "descriptionBn": "সার, মাটির স্বাস্থ্য, পরীক্ষা ও অনুমোদিত পরামর্শদাতা।",
    "descriptionEn": "Fertilizers, soil health, testing and qualified advisors.",
    "icon": "🧪"
  },
  {
    "slug": "pest-control",
    "titleBn": "বালাই ও রোগ ব্যবস্থাপনা",
    "titleEn": "Pest & Disease Management",
    "category": "কৃষি",
    "descriptionBn": "ফসলের রোগবালাই শনাক্তকরণ ও নিরাপদ ব্যবস্থাপনা সহায়তা।",
    "descriptionEn": "Crop pest identification and safe management support.",
    "icon": "🛡️"
  },
  {
    "slug": "irrigation",
    "titleBn": "সেচ ও পানি ব্যবস্থাপনা",
    "titleEn": "Irrigation & Water",
    "category": "কৃষি",
    "descriptionBn": "সেচযন্ত্র, পাম্প, পানি সরবরাহ ও সেচসেবা খোঁজা।",
    "descriptionEn": "Find irrigation equipment, pumps, water and irrigation services.",
    "icon": "💧"
  },
  {
    "slug": "farm-machinery",
    "titleBn": "কৃষিযন্ত্র ভাড়া ও মেরামত",
    "titleEn": "Farm Machinery",
    "category": "কৃষি",
    "descriptionBn": "ট্রাক্টর, পাওয়ার টিলার, হারভেস্টার ভাড়া ও মেরামত।",
    "descriptionEn": "Rent and repair tractors, power tillers and harvesters.",
    "icon": "🚜"
  },
  {
    "slug": "farm-labour",
    "titleBn": "কৃষিশ্রমিক বুকিং",
    "titleEn": "Farm Labour Booking",
    "category": "শ্রম",
    "descriptionBn": "রোপণ, আগাছা পরিষ্কার, ফসল কাটা ও মৌসুমি শ্রমিক বুকিং।",
    "descriptionEn": "Book workers for planting, weeding, harvesting and seasonal work.",
    "icon": "👩‍🌾"
  },
  {
    "slug": "livestock",
    "titleBn": "গবাদিপশু পালন",
    "titleEn": "Livestock",
    "category": "কৃষি",
    "descriptionBn": "গবাদিপশু পালন, খাদ্য, খামার ব্যবস্থাপনা ও সেবা।",
    "descriptionEn": "Livestock rearing, feed, farm management and services.",
    "icon": "🐄"
  },
  {
    "slug": "poultry",
    "titleBn": "পোল্ট্রি ও হাঁস-মুরগি",
    "titleEn": "Poultry",
    "category": "কৃষি",
    "descriptionBn": "পোল্ট্রি খামার, খাদ্য, সরঞ্জাম ও সেবা।",
    "descriptionEn": "Poultry farms, feed, equipment and services.",
    "icon": "🐔"
  },
  {
    "slug": "fisheries",
    "titleBn": "মৎস্য ও জলজ চাষ",
    "titleEn": "Fisheries & Aquaculture",
    "category": "কৃষি",
    "descriptionBn": "মাছ চাষ, পোনা, খাদ্য, পুকুর ও মৎস্যসেবা।",
    "descriptionEn": "Fish farming, fingerlings, feed, ponds and fisheries services.",
    "icon": "🐟"
  },
  {
    "slug": "farm-inputs",
    "titleBn": "কৃষি উপকরণ বাজার",
    "titleEn": "Farm Inputs Marketplace",
    "category": "বাজার",
    "descriptionBn": "কৃষি উপকরণ বিক্রেতা, পণ্যের তালিকা ও মূল্য অনুসন্ধান।",
    "descriptionEn": "Search farm-input sellers, listings and prices.",
    "icon": "🧰"
  },
  {
    "slug": "produce-market",
    "titleBn": "কৃষিপণ্য কেনাবেচা",
    "titleEn": "Produce Marketplace",
    "category": "বাজার",
    "descriptionBn": "কৃষক ও ক্রেতার মধ্যে কৃষিপণ্য কেনাবেচার অনুরোধ।",
    "descriptionEn": "Connect farmers and buyers for produce transactions.",
    "icon": "🛒"
  },
  {
    "slug": "wholesale-buyers",
    "titleBn": "পাইকারি ক্রেতা ও আড়তদার",
    "titleEn": "Wholesale Buyers & Aratdar",
    "category": "বাজার",
    "descriptionBn": "পাইকারি ক্রেতা, আড়তদার ও বাল্ক অর্ডারের সংযোগ।",
    "descriptionEn": "Connect with wholesale buyers, aratdars and bulk orders.",
    "icon": "🏬"
  },
  {
    "slug": "daily-market-price",
    "titleBn": "দৈনিক বাজারদর",
    "titleEn": "Daily Market Prices",
    "category": "বাজার",
    "descriptionBn": "বাজারভিত্তিক পণ্যের দাম জমা, যাচাই ও প্রদর্শন।",
    "descriptionEn": "Submit, verify and display market-specific prices.",
    "icon": "📊"
  },
  {
    "slug": "storage-warehouse",
    "titleBn": "গুদাম ও সংরক্ষণ",
    "titleEn": "Storage & Warehousing",
    "category": "বাজার",
    "descriptionBn": "গুদাম, শীতল সংরক্ষণ ও ফসল রাখার জায়গা খোঁজা।",
    "descriptionEn": "Find warehouses, cold storage and crop storage.",
    "icon": "🏢"
  },
  {
    "slug": "transport-logistics",
    "titleBn": "পরিবহন ও লজিস্টিকস",
    "titleEn": "Transport & Logistics",
    "category": "বাজার",
    "descriptionBn": "ফসল পরিবহন, ট্রাক/ভ্যান বুকিং ও ডেলিভারি সমন্বয়।",
    "descriptionEn": "Arrange crop transport, truck/van bookings and delivery.",
    "icon": "🚚"
  },
  {
    "slug": "food-processing",
    "titleBn": "প্রক্রিয়াজাতকরণ ও প্যাকেজিং",
    "titleEn": "Processing & Packaging",
    "category": "বাজার",
    "descriptionBn": "কৃষিপণ্য প্রক্রিয়াজাতকরণ, গ্রেডিং ও প্যাকেজিং সেবা।",
    "descriptionEn": "Find produce processing, grading and packaging services.",
    "icon": "📦"
  },
  {
    "slug": "export-support",
    "titleBn": "রপ্তানি সহায়তা",
    "titleEn": "Export Support",
    "category": "বাজার",
    "descriptionBn": "রপ্তানি-উপযোগী পণ্য, মান, প্যাকেজিং ও সেবাদাতা সংযোগ।",
    "descriptionEn": "Connect with export-oriented product, quality and packaging services.",
    "icon": "🌍"
  },
  {
    "slug": "land-equipment",
    "titleBn": "কৃষিজমি ও যন্ত্রপাতি",
    "titleEn": "Farm Land & Equipment",
    "category": "কৃষি",
    "descriptionBn": "কৃষিজমি, যন্ত্রপাতি ও কৃষি-সম্পদ সংক্রান্ত অনুসন্ধান।",
    "descriptionEn": "Explore farm land, equipment and agricultural assets.",
    "icon": "🗺️"
  },
  {
    "slug": "training-advice",
    "titleBn": "কৃষি প্রশিক্ষণ ও পরামর্শ",
    "titleEn": "Training & Advisory",
    "category": "কৃষি",
    "descriptionBn": "প্রশিক্ষণ, অভিজ্ঞতা বিনিময় ও বিশেষজ্ঞ পরামর্শের অনুরোধ।",
    "descriptionEn": "Request training, knowledge sharing and expert advice.",
    "icon": "🎓"
  },
  {
    "slug": "organic-farming",
    "titleBn": "জৈব কৃষি",
    "titleEn": "Organic Farming",
    "category": "কৃষি",
    "descriptionBn": "জৈব উৎপাদন, কম্পোস্ট ও টেকসই কৃষি পদ্ধতি।",
    "descriptionEn": "Organic production, compost and sustainable farming methods.",
    "icon": "🍃"
  },
  {
    "slug": "contract-farming",
    "titleBn": "চুক্তিভিত্তিক চাষ",
    "titleEn": "Contract Farming",
    "category": "বাজার",
    "descriptionBn": "চাষি ও ক্রেতার মধ্যে শর্তসাপেক্ষ উৎপাদন চুক্তির সংযোগ।",
    "descriptionEn": "Connect farmers and buyers for agreed production contracts.",
    "icon": "🤝"
  },
  {
    "slug": "farm-finance",
    "titleBn": "কৃষি অর্থায়ন তথ্য",
    "titleEn": "Agricultural Finance Info",
    "category": "অর্থায়ন",
    "descriptionBn": "কৃষি ঋণ, অর্থায়ন পণ্য ও যোগ্যতার তথ্য অনুসন্ধান।",
    "descriptionEn": "Explore agricultural loan products and eligibility information.",
    "icon": "💳"
  },
  {
    "slug": "insurance-claims",
    "titleBn": "ফসল বীমা ও ক্ষতিপূরণ তথ্য",
    "titleEn": "Crop Insurance Info",
    "category": "অর্থায়ন",
    "descriptionBn": "বীমা পণ্য, দাবি প্রক্রিয়া ও সংশ্লিষ্ট সেবা সম্পর্কে তথ্য।",
    "descriptionEn": "Information on insurance products, claims and related services.",
    "icon": "🧾"
  },
  {
    "slug": "weather-alerts",
    "titleBn": "আবহাওয়া ও সতর্কতা",
    "titleEn": "Weather & Alerts",
    "category": "তথ্য",
    "descriptionBn": "আবহাওয়া-সংক্রান্ত তথ্য ও সতর্কতা প্রকাশের স্থান।",
    "descriptionEn": "A place for weather information and alerts.",
    "icon": "🌦️"
  },
  {
    "slug": "disaster-support",
    "titleBn": "দুর্যোগে কৃষি সহায়তা",
    "titleEn": "Agriculture Disaster Support",
    "category": "তথ্য",
    "descriptionBn": "বন্যা, খরা ও দুর্যোগের পর সহায়তার অনুরোধ ও সমন্বয়।",
    "descriptionEn": "Coordinate support requests after floods, droughts and disasters.",
    "icon": "🆘"
  },
  {
    "slug": "women-farmers",
    "titleBn": "নারী কৃষক ও উদ্যোক্তা",
    "titleEn": "Women Farmers & Entrepreneurs",
    "category": "কমিউনিটি",
    "descriptionBn": "নারী কৃষক ও কৃষি উদ্যোক্তাদের বাজার ও সেবায় সংযোগ।",
    "descriptionEn": "Connect women farmers and agripreneurs with markets and services.",
    "icon": "👩‍🌾"
  },
  {
    "slug": "youth-agripreneurs",
    "titleBn": "যুব কৃষি উদ্যোক্তা",
    "titleEn": "Youth Agripreneurs",
    "category": "কমিউনিটি",
    "descriptionBn": "যুব উদ্যোক্তাদের ধারণা, প্রশিক্ষণ, বাজার ও অংশীদার খোঁজা।",
    "descriptionEn": "Help young agripreneurs find ideas, training, markets and partners.",
    "icon": "🚀"
  },
  {
    "slug": "worker-marketplace",
    "titleBn": "শ্রম ও দক্ষ কর্মী মার্কেটপ্লেস",
    "titleEn": "Worker Marketplace",
    "category": "শ্রম",
    "descriptionBn": "কৃষি ও বাজার-সম্পর্কিত কাজের জন্য দক্ষ/অদক্ষ কর্মী খোঁজা।",
    "descriptionEn": "Find skilled and general workers for agriculture and market-related jobs.",
    "icon": "🧑‍🔧"
  },
  {
    "slug": "community-reports",
    "titleBn": "কৃষি সমস্যা ও কমিউনিটি রিপোর্ট",
    "titleEn": "Community Reports",
    "category": "কমিউনিটি",
    "descriptionBn": "স্থানীয় কৃষি সমস্যা, বাজার অনিয়ম বা সেবার সমস্যা রিপোর্ট করা।",
    "descriptionEn": "Report local farming issues, market irregularities or service problems.",
    "icon": "📣"
  }
];

async function main() {
  for (const panel of panels) {
    await prisma.panel.upsert({
      where: { slug: panel.slug },
      update: panel,
      create: panel,
    });
  }

  console.log(`Seeded ${panels.length} panels.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
