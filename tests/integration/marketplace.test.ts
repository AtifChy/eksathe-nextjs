import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";
import { Prisma } from "@/generated/prisma/client";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) throw new Error("Set TEST_DATABASE_URL to a dedicated, migrated PostgreSQL test database before running integration tests.");
process.env.DATABASE_URL = testDatabaseUrl;
mock.module("server-only", () => ({}));

const [{ prisma }, marketplace, { getAdminWorkspace }] = await Promise.all([
  import("@/lib/prisma"),
  import("@/lib/domain/marketplace"),
  import("@/lib/workspaces"),
]);

const suffix = crypto.randomUUID();
const buyerId = "test-buyer-" + suffix;
const buyerTwoId = "test-buyer-two-" + suffix;
const providerUserId = "test-provider-" + suffix;
const financeUserId = "test-finance-" + suffix;
let providerId = "";
const requestIds: string[] = [];
const listingIds: string[] = [];
const orderIds: string[] = [];

async function createRequestAndQuote(listingId: string, customerId: string) {
  const request = await prisma.marketplaceRequest.create({
    data: {
      buyerId: customerId,
      providerId,
      listingId,
      sectorSlug: "agriculture-labor",
      quantity: new Prisma.Decimal(1),
      district: "Dhaka",
      details: "Integration test request",
    },
    select: { id: true },
  });
  requestIds.push(request.id);
  await marketplace.submitQuote(providerUserId, { requestId: request.id, quantity: "1", unitPrice: "10", transportFee: "0", note: "Test terms" });
  return request.id;
}

async function createListing(stock: string, sectorSlug = "agriculture-labor", kind: "PRODUCE" | "CONSTRUCTION_MATERIAL" = "PRODUCE") {
  const listing = await prisma.marketplaceListing.create({
    data: {
      providerId,
      sectorSlug,
      kind,
      titleBn: "পরীক্ষার ধান",
      titleEn: kind === "PRODUCE" ? "Test rice" : "Test cement",
      descriptionBn: "",
      descriptionEn: "",
      category: kind === "PRODUCE" ? "Rice" : "Cement",
      district: "Dhaka",
      unit: kind === "PRODUCE" ? "kg" : "bag",
      unitPrice: new Prisma.Decimal(10),
      stock: new Prisma.Decimal(stock),
      moderationStatus: "APPROVED",
      isPublished: true,
    },
    select: { id: true },
  });
  listingIds.push(listing.id);
  return listing.id;
}

describe("PostgreSQL marketplace transactions", () => {
  beforeAll(async () => {
    await prisma.sector.upsert({
      where: { slug: "agriculture-labor" },
      update: { status: "LIVE", commissionRate: new Prisma.Decimal("10.00") },
      create: { slug: "agriculture-labor", position: 4, titleBn: "কৃষি ও শ্রমিক", titleEn: "Agriculture & Labor", icon: "🌾", status: "LIVE", commissionRate: new Prisma.Decimal("10.00") },
    });
    await prisma.sector.upsert({
      where: { slug: "construction" },
      update: { status: "LIVE", commissionRate: new Prisma.Decimal("10.00") },
      create: { slug: "construction", position: 5, titleBn: "নির্মাণ", titleEn: "Construction", icon: "🏗️", status: "LIVE", commissionRate: new Prisma.Decimal("10.00") },
    });
    for (const [id, role] of [[buyerId, "customer"], [buyerTwoId, "customer"], [providerUserId, "customer"], [financeUserId, "super_admin"]] as const) {
      await prisma.user.create({ data: { id, name: id, email: id + "@integration.example", emailVerified: true, phone: "+8801700000000", role, status: "active" } });
    }
    const profile = await prisma.providerProfile.create({ data: { userId: providerUserId, nameBn: "পরীক্ষার কৃষক", nameEn: "Test farmer", district: "Dhaka", status: "APPROVED" }, select: { id: true } });
    providerId = profile.id;
    await prisma.providerCapability.create({ data: { providerId, sectorSlug: "agriculture-labor", kind: "PRODUCE", status: "APPROVED" } });
    await prisma.providerCapability.create({ data: { providerId, sectorSlug: "construction", kind: "CONSTRUCTION_MATERIAL", status: "APPROVED" } });
  });

  it("completes a request, quote, order, confirmed payment, review, and commission receipt", async () => {
    const listingId = await createListing("5");
    const requestId = await createRequestAndQuote(listingId, buyerId);
    const order = await marketplace.acceptQuote(buyerId, requestId);
    orderIds.push(order.id);
    expect((await prisma.marketplaceListing.findUniqueOrThrow({ where: { id: listingId }, select: { stock: true } })).stock.toString()).toBe("4");

    const payment = await marketplace.recordPayment(buyerId, { orderId: order.id, amount: "10", method: "BANK_TRANSFER", reference: "integration-payment" });
    await marketplace.confirmPayment(providerUserId, order.id, payment.id);
    await marketplace.progressOrder(providerUserId, order.id, "start");
    await marketplace.progressOrder(providerUserId, order.id, "submit");
    await marketplace.progressOrder(buyerId, order.id, "confirm");
    await marketplace.writeReview(buyerId, order.id, 5, "Integration review");

    const commission = await prisma.commissionRecord.findUniqueOrThrow({ where: { orderId: order.id } });
    expect(commission.amount.toFixed(2)).toBe("1.00");
    await marketplace.markCommissionCollected(financeUserId, commission.id, "integration-receipt");
    const completedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
      select: { status: true, review: { select: { rating: true } }, commission: { select: { status: true, reference: true } }, payments: { select: { buyerConfirmedAt: true, providerConfirmedAt: true } } },
    });
    expect(completedOrder.status).toBe("COMPLETED");
    expect(completedOrder.review?.rating).toBe(5);
    expect(completedOrder.commission).toEqual({ status: "COLLECTED", reference: "integration-receipt" });
    expect(Boolean(completedOrder.payments[0]?.buyerConfirmedAt && completedOrder.payments[0]?.providerConfirmedAt)).toBe(true);
    expect(await prisma.activityLog.count({ where: { entityType: "order", entityId: order.id } })).toBeGreaterThanOrEqual(3);
  });

  it("does not oversell when two customers accept quotes concurrently", async () => {
    const listingId = await createListing("1");
    const [firstRequest, secondRequest] = await Promise.all([
      createRequestAndQuote(listingId, buyerId),
      createRequestAndQuote(listingId, buyerTwoId),
    ]);
    const results = await Promise.allSettled([
      marketplace.acceptQuote(buyerId, firstRequest),
      marketplace.acceptQuote(buyerTwoId, secondRequest),
    ]);
    for (const result of results) if (result.status === "fulfilled") orderIds.push(result.value.id);
    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect((await prisma.marketplaceListing.findUniqueOrThrow({ where: { id: listingId }, select: { stock: true } })).stock.toString()).toBe("0");
    expect(await prisma.order.count({ where: { listingId } })).toBe(1);
  });

  it("limits the operations request queue to open requests in assigned sectors", async () => {
    const agricultureListingId = await createListing("10");
    const constructionListingId = await createListing("10", "construction", "CONSTRUCTION_MATERIAL");
    const agricultureRequest = await prisma.marketplaceRequest.create({
      data: { buyerId, providerId, listingId: agricultureListingId, sectorSlug: "agriculture-labor", quantity: new Prisma.Decimal(1), district: "Dhaka", details: "Active agriculture request" },
      select: { id: true },
    });
    const constructionRequest = await prisma.marketplaceRequest.create({
      data: { buyerId, providerId, listingId: constructionListingId, sectorSlug: "construction", quantity: new Prisma.Decimal(1), district: "Dhaka", details: "Construction request" },
      select: { id: true },
    });
    const cancelledRequest = await prisma.marketplaceRequest.create({
      data: { buyerId, providerId, listingId: agricultureListingId, sectorSlug: "agriculture-labor", quantity: new Prisma.Decimal(1), district: "Dhaka", details: "Closed request", status: "CANCELLED" },
      select: { id: true },
    });
    requestIds.push(agricultureRequest.id, constructionRequest.id, cancelledRequest.id);

    const workspace = await getAdminWorkspace({ isSuperAdmin: false, operationSectors: ["agriculture-labor"], financeSectors: [], canManageStaff: false });
    const requestIdsInQueue = workspace.requests.map(({ id }) => id);
    expect(requestIdsInQueue).toContain(agricultureRequest.id);
    expect(requestIdsInQueue).not.toContain(constructionRequest.id);
    expect(requestIdsInQueue).not.toContain(cancelledRequest.id);
  });

  afterAll(async () => {
    await prisma.paymentRecord.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.review.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.commissionRecord.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.booking.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
    await prisma.quote.deleteMany({ where: { requestId: { in: requestIds } } });
    await prisma.marketplaceRequest.deleteMany({ where: { id: { in: requestIds } } });
    await prisma.marketplaceListing.deleteMany({ where: { id: { in: listingIds } } });
    await prisma.activityLog.deleteMany({ where: { userId: { in: [buyerId, buyerTwoId, providerUserId, financeUserId] } } });
    await prisma.notification.deleteMany({ where: { userId: { in: [buyerId, buyerTwoId, providerUserId, financeUserId] } } });
    await prisma.providerCapability.deleteMany({ where: { providerId } });
    await prisma.providerProfile.deleteMany({ where: { id: providerId } });
    await prisma.user.deleteMany({ where: { id: { in: [buyerId, buyerTwoId, providerUserId, financeUserId] } } });
    await prisma.$disconnect();
  });
});
