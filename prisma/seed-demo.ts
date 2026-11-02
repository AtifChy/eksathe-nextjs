import "dotenv/config";
import { hashPassword } from "better-auth/crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;
if (process.env.SEED_DEMO_DATA !== "true") {
  throw new Error("Set SEED_DEMO_DATA=true to load the local demo records.");
}
if (process.env.NODE_ENV === "production") {
  throw new Error("Demo records cannot be loaded in production.");
}
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const databaseHost = new URL(databaseUrl).hostname.replace(/^\[|\]$/g, "");
if (!["localhost", "127.0.0.1", "::1"].includes(databaseHost)) {
  throw new Error("Demo records can only be loaded into a local database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
const password = "Demo-only-123!";
const decimal = (value: string) => new Prisma.Decimal(value);
const inDays = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
  const passwordHash = await hashPassword(password);
  const buyer = await ensureUser({
    id: "demo-buyer-ek",
    name: "Demo Buyer",
    email: "demo.buyer@example.com",
    phone: "+8801700000101",
    passwordHash,
  });
  const farmer = await ensureUser({
    id: "demo-farmer-ek",
    name: "Demo Farmer",
    email: "demo.farmer@example.com",
    phone: "+8801700000102",
    passwordHash,
  });
  const builder = await ensureUser({
    id: "demo-builder-ek",
    name: "Demo Construction Provider",
    email: "demo.builder@example.com",
    phone: "+8801700000103",
    passwordHash,
  });

  const farmProfile = await prisma.providerProfile.upsert({
    where: { userId: farmer.id },
    update: {},
    create: {
      id: "demo-farm-provider",
      userId: farmer.id,
      nameBn: "সবুজ মাঠ খামার",
      nameEn: "Green Fields Farm",
      bioBn: "স্থানীয় মৌসুমি ফসল, কৃষিশ্রমিক ও যন্ত্র ভাড়ার সেবা।",
      bioEn: "Local seasonal produce, farm workers and equipment hire.",
      district: "Dhaka",
      upazila: "Savar",
      status: "APPROVED",
      reviewedAt: new Date(),
    },
  });
  const constructionProfile = await prisma.providerProfile.upsert({
    where: { userId: builder.id },
    update: {},
    create: {
      id: "demo-construction-provider",
      userId: builder.id,
      nameBn: "নির্মাণ সাথী",
      nameEn: "Nirman Sathi",
      bioBn: "নির্মাণসামগ্রী সরবরাহ ও অভিজ্ঞ প্রকৌশলী পরামর্শ।",
      bioEn: "Construction material supply and experienced engineering advice.",
      district: "Dhaka",
      upazila: "Dhanmondi",
      status: "APPROVED",
      reviewedAt: new Date(),
    },
  });

  const capabilities = [
    { providerId: farmProfile.id, sectorSlug: "agriculture-labor", kind: "PRODUCE" as const },
    { providerId: farmProfile.id, sectorSlug: "agriculture-labor", kind: "WORKER" as const },
    { providerId: farmProfile.id, sectorSlug: "agriculture-labor", kind: "MACHINERY" as const },
    { providerId: constructionProfile.id, sectorSlug: "construction", kind: "CONSTRUCTION_MATERIAL" as const },
    { providerId: constructionProfile.id, sectorSlug: "construction", kind: "CONSTRUCTION_SERVICE" as const },
  ];
  for (const capability of capabilities) {
    await prisma.providerCapability.upsert({
      where: { providerId_sectorSlug_kind: capability },
      update: { status: "APPROVED", reviewedAt: new Date() },
      create: { ...capability, status: "APPROVED", reviewedAt: new Date() },
    });
  }

  const listings = [
    {
      id: "demo-listing-rice",
      providerId: farmProfile.id,
      sectorSlug: "agriculture-labor",
      kind: "PRODUCE" as const,
      titleBn: "সাভারের নতুন আমন চাল",
      titleEn: "Fresh Savar Aman Rice",
      descriptionBn: "পরিষ্কার, সদ্য প্রক্রিয়াজাত আমন চাল। সংগ্রহ বা পরিবহনের ব্যবস্থা ক্রেতা ও বিক্রেতা ঠিক করবেন।",
      descriptionEn: "Clean, freshly processed Aman rice. Buyer and seller can agree on collection or transport.",
      category: "Rice",
      district: "Dhaka",
      unit: "kg",
      unitPrice: decimal("62"),
      stock: decimal("400"),
      availableFrom: new Date(),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-tomato",
      providerId: farmProfile.id,
      sectorSlug: "agriculture-labor",
      kind: "PRODUCE" as const,
      titleBn: "মৌসুমি টমেটো",
      titleEn: "Seasonal Tomatoes",
      descriptionBn: "সাভারে উৎপাদিত তাজা টমেটো, সীমিত পরিমাণে পাওয়া যাচ্ছে।",
      descriptionEn: "Fresh tomatoes grown in Savar, available in limited quantities.",
      category: "Vegetables",
      district: "Dhaka",
      unit: "kg",
      unitPrice: decimal("45"),
      stock: decimal("250"),
      availableFrom: new Date(),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-workers",
      providerId: farmProfile.id,
      sectorSlug: "agriculture-labor",
      kind: "WORKER" as const,
      titleBn: "ধান কাটার অভিজ্ঞ শ্রমিক দল",
      titleEn: "Experienced Rice Harvesting Crew",
      descriptionBn: "চারজন অভিজ্ঞ শ্রমিকের দল। কাজের সময়, জমির অবস্থা ও যাতায়াতের শর্ত আগে আলোচনা করুন।",
      descriptionEn: "A crew of four experienced workers. Agree on schedule, field conditions and travel terms first.",
      category: "Harvesting",
      district: "Dhaka",
      unit: "day",
      unitPrice: decimal("3600"),
      stock: decimal("0"),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-tiller",
      providerId: farmProfile.id,
      sectorSlug: "agriculture-labor",
      kind: "MACHINERY" as const,
      titleBn: "অপারেটরসহ পাওয়ার টিলার",
      titleEn: "Power Tiller with Operator",
      descriptionBn: "অপারেটরসহ দৈনিক ভাড়া। জ্বালানি ও পরিবহন খরচ বুকিংয়ের আগে নিশ্চিত করুন।",
      descriptionEn: "Daily hire with operator. Confirm fuel and transport charges before booking.",
      category: "Tillage",
      district: "Dhaka",
      unit: "day",
      unitPrice: decimal("2800"),
      stock: decimal("0"),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-cement",
      providerId: constructionProfile.id,
      sectorSlug: "construction",
      kind: "CONSTRUCTION_MATERIAL" as const,
      titleBn: "৫০ কেজি পোর্টল্যান্ড সিমেন্ট",
      titleEn: "50 kg Portland Cement",
      descriptionBn: "মানসম্মত সিমেন্টের বস্তা। স্টক, পরিবহন ও সাইটে নামানোর খরচ অর্ডারের আগে নিশ্চিত করুন।",
      descriptionEn: "Quality cement bags. Confirm stock, transport and site unloading charges before ordering.",
      category: "Cement",
      district: "Dhaka",
      unit: "bag",
      unitPrice: decimal("560"),
      stock: decimal("180"),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-brick",
      providerId: constructionProfile.id,
      sectorSlug: "construction",
      kind: "CONSTRUCTION_MATERIAL" as const,
      titleBn: "প্রথম শ্রেণির লাল ইট",
      titleEn: "First Class Red Bricks",
      descriptionBn: "পরিদর্শন ও পরিবহন শর্ত সরবরাহকারীর সঙ্গে নিশ্চিত করুন।",
      descriptionEn: "Confirm inspection and delivery terms with the supplier.",
      category: "Bricks",
      district: "Dhaka",
      unit: "piece",
      unitPrice: decimal("14"),
      stock: decimal("12000"),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
    {
      id: "demo-listing-engineer",
      providerId: constructionProfile.id,
      sectorSlug: "construction",
      kind: "CONSTRUCTION_SERVICE" as const,
      titleBn: "বাড়ির কাঠামোগত পরামর্শ",
      titleEn: "Residential Structural Consultation",
      descriptionBn: "প্রাথমিক নকশা পর্যালোচনা, সাইট পরিদর্শন ও কাঠামোগত পরামর্শ। কাজের পরিধি কোটেশনে নির্ধারিত হবে।",
      descriptionEn: "Initial plan review, site visit and structural advice. Scope is agreed in the quote.",
      category: "Engineering",
      district: "Dhaka",
      unit: "job",
      unitPrice: decimal("15000"),
      stock: decimal("0"),
      moderationStatus: "APPROVED" as const,
      isPublished: true,
    },
  ];
  for (const listing of listings) {
    await prisma.marketplaceListing.upsert({
      where: { id: listing.id },
      update: {},
      create: listing,
    });
  }

  const project = await prisma.constructionProject.upsert({
    where: { id: "demo-project-family-home" },
    update: {},
    create: {
      id: "demo-project-family-home",
      ownerId: buyer.id,
      sectorSlug: "construction",
      title: "ধানমন্ডি দুইতলা পরিবারের বাড়ি",
      projectType: "Residential home",
      district: "Dhaka",
      description: "A demo project for comparing a structural consultation and material quotes, then tracking the work in milestones.",
      approximateArea: "2,400 sq ft",
      budget: decimal("8500000"),
      startsAt: inDays(14),
      targetEndsAt: inDays(180),
      status: "ACTIVE",
    },
  });

  const requests = [
    {
      id: "demo-request-rice",
      buyerId: buyer.id,
      providerId: farmProfile.id,
      listingId: "demo-listing-rice",
      sectorSlug: "agriculture-labor",
      quantity: decimal("100"),
      district: "Dhaka",
      details: "Please confirm the harvest batch and collection date.",
      status: "ACCEPTED" as const,
    },
    {
      id: "demo-request-workers",
      buyerId: buyer.id,
      providerId: farmProfile.id,
      listingId: "demo-listing-workers",
      sectorSlug: "agriculture-labor",
      quantity: decimal("1"),
      district: "Dhaka",
      details: "Need the crew for one day to harvest a small paddy field.",
      requestedStart: inDays(20),
      requestedEnd: inDays(21),
      status: "QUOTED" as const,
    },
    {
      id: "demo-request-tiller",
      buyerId: buyer.id,
      providerId: farmProfile.id,
      listingId: "demo-listing-tiller",
      sectorSlug: "agriculture-labor",
      quantity: decimal("2"),
      district: "Dhaka",
      details: "Two days of land preparation; please confirm operator and fuel terms.",
      requestedStart: inDays(30),
      requestedEnd: inDays(32),
      status: "OPEN" as const,
    },
    {
      id: "demo-request-cement",
      buyerId: buyer.id,
      providerId: constructionProfile.id,
      listingId: "demo-listing-cement",
      sectorSlug: "construction",
      projectId: project.id,
      packageLabel: "foundation-cement",
      quantity: decimal("80"),
      district: "Dhaka",
      details: "Quote for 80 bags including delivery to the Dhanmondi site.",
      status: "QUOTED" as const,
    },
    {
      id: "demo-request-engineer",
      buyerId: buyer.id,
      providerId: constructionProfile.id,
      listingId: "demo-listing-engineer",
      sectorSlug: "construction",
      projectId: project.id,
      packageLabel: "structural-consultation",
      quantity: decimal("1"),
      district: "Dhaka",
      details: "Review the initial plan and advise on the structural design before construction.",
      requestedStart: inDays(14),
      status: "ACCEPTED" as const,
    },
  ];
  for (const request of requests) {
    await prisma.marketplaceRequest.upsert({
      where: { id: request.id },
      update: {},
      create: request,
    });
  }

  const quotes = [
    {
      id: "demo-quote-rice",
      requestId: "demo-request-rice",
      quantity: decimal("100"),
      unitPrice: decimal("62"),
      transportFee: decimal("0"),
      note: "Freshly processed rice; collection by arrangement.",
      acceptedAt: new Date(),
      status: "ACCEPTED" as const,
    },
    {
      id: "demo-quote-workers",
      requestId: "demo-request-workers",
      quantity: decimal("1"),
      unitPrice: decimal("3600"),
      transportFee: decimal("400"),
      note: "Four workers for one day; transport included in the separate fee.",
      expiresAt: inDays(7),
      status: "PENDING" as const,
    },
    {
      id: "demo-quote-cement",
      requestId: "demo-request-cement",
      quantity: decimal("80"),
      unitPrice: decimal("560"),
      transportFee: decimal("1200"),
      note: "Delivery to Dhanmondi site; unloading arranged by buyer.",
      expiresAt: inDays(7),
      status: "PENDING" as const,
    },
    {
      id: "demo-quote-engineer",
      requestId: "demo-request-engineer",
      quantity: decimal("1"),
      unitPrice: decimal("15000"),
      transportFee: decimal("0"),
      note: "Plan review and one site visit, with a written recommendation.",
      acceptedAt: new Date(),
      status: "ACCEPTED" as const,
    },
  ];
  for (const quote of quotes) {
    await prisma.quote.upsert({
      where: { requestId: quote.requestId },
      update: {},
      create: quote,
    });
  }

  const orders = [
    {
      id: "demo-order-rice",
      requestId: "demo-request-rice",
      quoteId: "demo-quote-rice",
      buyerId: buyer.id,
      providerId: farmProfile.id,
      listingId: "demo-listing-rice",
      quantity: decimal("100"),
      unit: "kg",
      unitPrice: decimal("62"),
      subtotal: decimal("6200"),
      transportFee: decimal("0"),
      commissionRate: decimal("10"),
      commissionAmount: decimal("620"),
      providerAmount: decimal("5580"),
      status: "IN_PROGRESS" as const,
    },
    {
      id: "demo-order-engineer",
      requestId: "demo-request-engineer",
      quoteId: "demo-quote-engineer",
      buyerId: buyer.id,
      providerId: constructionProfile.id,
      listingId: "demo-listing-engineer",
      projectId: project.id,
      packageLabel: "structural-consultation",
      quantity: decimal("1"),
      unit: "job",
      unitPrice: decimal("15000"),
      subtotal: decimal("15000"),
      transportFee: decimal("0"),
      commissionRate: decimal("10"),
      commissionAmount: decimal("1500"),
      providerAmount: decimal("13500"),
      status: "CONFIRMED" as const,
    },
  ];
  for (const order of orders) {
    await prisma.order.upsert({
      where: { requestId: order.requestId },
      update: {},
      create: order,
    });
  }

  await prisma.paymentRecord.upsert({
    where: { id: "demo-payment-rice" },
    update: {},
    create: {
      id: "demo-payment-rice",
      orderId: "demo-order-rice",
      submittedById: buyer.id,
      amount: decimal("6200"),
      method: "MOBILE_WALLET",
      reference: "DEMO-MOBILE-001",
      paidAt: new Date(),
      buyerConfirmedAt: new Date(),
      providerConfirmedAt: new Date(),
    },
  });

  const milestones = [
    {
      id: "demo-milestone-planning",
      projectId: project.id,
      title: "Initial project planning",
      description: "Project brief, schedule and initial requirements recorded.",
      amount: decimal("0"),
      dueAt: inDays(7),
      status: "APPROVED" as const,
    },
    {
      id: "demo-milestone-structural-review",
      projectId: project.id,
      title: "Structural plan review",
      description: "Provider to review the plan and submit written recommendations.",
      amount: decimal("15000"),
      dueAt: inDays(28),
      status: "IN_PROGRESS" as const,
    },
    {
      id: "demo-milestone-foundation",
      projectId: project.id,
      title: "Foundation and material preparation",
      description: "Confirm the material quote and prepare for foundation work.",
      amount: decimal("1200000"),
      dueAt: inDays(60),
      status: "PENDING" as const,
    },
  ];
  for (const milestone of milestones) {
    await prisma.projectMilestone.upsert({
      where: { id: milestone.id },
      update: {},
      create: milestone,
    });
  }

  const notifications = [
    {
      id: "demo-notification-buyer",
      userId: buyer.id,
      title: "A construction quote is ready",
      message: "The structural consultation quote is accepted for your project.",
      titleBn: "নির্মাণের কোটেশন প্রস্তুত",
      titleEn: "A construction quote is ready",
      messageBn: "আপনার প্রকল্পে কাঠামোগত পরামর্শের কোটেশন গ্রহণ করা হয়েছে।",
      messageEn: "The structural consultation quote is accepted for your project.",
      href: "/account#projects",
    },
    {
      id: "demo-notification-farmer",
      userId: farmer.id,
      title: "A buyer has confirmed a produce order",
      message: "The buyer confirmed payment for the rice order.",
      titleBn: "একজন ক্রেতা পণ্যের অর্ডার নিশ্চিত করেছেন",
      titleEn: "A buyer has confirmed a produce order",
      messageBn: "ক্রেতা চালের অর্ডারের পেমেন্ট নিশ্চিত করেছেন।",
      messageEn: "The buyer confirmed payment for the rice order.",
      href: "/provider#orders",
    },
    {
      id: "demo-notification-builder",
      userId: builder.id,
      title: "A project consultation is booked",
      message: "A customer accepted your structural consultation quote.",
      titleBn: "প্রকল্পের পরামর্শের কাজ নিশ্চিত হয়েছে",
      titleEn: "A project consultation is booked",
      messageBn: "একজন গ্রাহক আপনার কাঠামোগত পরামর্শের কোটেশন গ্রহণ করেছেন।",
      messageEn: "A customer accepted your structural consultation quote.",
      href: "/provider#orders",
    },
  ];
  for (const notification of notifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: {},
      create: notification,
    });
  }

  console.log("Loaded local EKsathe demo data: 3 accounts, 7 listings, 5 requests, 2 orders and 1 project.");
  console.log("Demo account password: Demo-only-123!");
}

async function ensureUser(input: {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
}) {
  const user = await prisma.user.upsert({
    where: { email: input.email },
    update: { emailVerified: true, phone: input.phone, status: "active" },
    create: {
      id: input.id,
      name: input.name,
      email: input.email,
      emailVerified: true,
      phone: input.phone,
      role: "customer",
      status: "active",
    },
  });

  await prisma.account.upsert({
    where: { id: `demo-account-${input.id}` },
    update: { accountId: user.id, providerId: "credential", userId: user.id, password: input.passwordHash },
    create: {
      id: `demo-account-${input.id}`,
      accountId: user.id,
      providerId: "credential",
      userId: user.id,
      password: input.passwordHash,
    },
  });
  return user;
}

main()
  .catch((error) => {
    const detail = error instanceof Error ? error.message : "Unknown error";
    const metadata = error && typeof error === "object" && "meta" in error ? JSON.stringify(error.meta) : undefined;
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : undefined;
    console.error("Failed to load local EKsathe demo data.", { code, detail, metadata });
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
