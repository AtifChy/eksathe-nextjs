import "server-only";

import type { RequestStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { StaffAccess } from "@/lib/dal";

const decimal = (value: { toString(): string } | null | undefined) => value?.toString() ?? null;
const iso = (value: Date | null | undefined) => value?.toISOString() ?? null;

export async function getCustomerWorkspace(userId: string) {
  const [requests, orders, projects, notifications, agricultureRequests] = await Promise.all([
    prisma.marketplaceRequest.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true, district: true } },
        provider: { select: { nameBn: true, nameEn: true } },
        quote: true,
        order: { select: { id: true, status: true } },
      },
    }),
    prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true } },
        provider: { select: { nameBn: true, nameEn: true, userId: true } },
        booking: true,
        payments: { orderBy: { createdAt: "desc" } },
        commission: true,
        review: true,
      },
    }),
    prisma.constructionProject.findMany({
      where: { ownerId: userId },
      orderBy: { updatedAt: "desc" },
      include: {
        milestones: { orderBy: { createdAt: "asc" } },
        orders: { include: { listing: { select: { titleBn: true, titleEn: true, kind: true } }, provider: { select: { nameBn: true, nameEn: true } }, payments: { orderBy: { createdAt: "desc" } } } },
        requests: { include: { listing: { select: { titleBn: true, titleEn: true, kind: true } }, provider: { select: { id: true, nameBn: true, nameEn: true } }, quote: true, order: { select: { id: true, status: true } } } },
        documents: { select: { id: true, filename: true, contentType: true, sizeBytes: true, createdAt: true } },
        expenses: { orderBy: { occurredAt: "desc" } },
      },
    }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.serviceRequest.findMany({
      where: { userId, serviceDefinition: { sectorSlug: "agriculture-labor" } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        serviceDefinition: { select: { slug: true, titleBn: true, titleEn: true, icon: true } },
        updates: { where: { visibility: "CUSTOMER" }, orderBy: { createdAt: "desc" }, take: 5 },
        attachments: { select: { id: true, filename: true, contentType: true, sizeBytes: true } },
      },
    }),
  ]);

  return {
    requests: requests.map((request) => ({
      id: request.id,
      status: request.status,
      sectorSlug: request.sectorSlug,
      quantity: request.quantity.toString(),
      district: request.district,
      details: request.details,
      requestedStart: iso(request.requestedStart),
      requestedEnd: iso(request.requestedEnd),
      createdAt: iso(request.createdAt),
      listing: request.listing,
      provider: request.provider,
      quote: request.quote ? {
        id: request.quote.id,
        status: request.quote.status,
        quantity: request.quote.quantity.toString(),
        unitPrice: request.quote.unitPrice.toString(),
        transportFee: request.quote.transportFee.toString(),
        note: request.quote.note,
        expiresAt: iso(request.quote.expiresAt),
      } : null,
      order: request.order,
    })),
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      quantity: order.quantity.toString(),
      unit: order.unit,
      unitPrice: order.unitPrice.toString(),
      subtotal: order.subtotal.toString(),
      transportFee: order.transportFee.toString(),
      commissionAmount: order.commissionAmount.toString(),
      commissionRate: order.commissionRate.toString(),
      cancellationReason: order.cancellationReason,
      cancelRequestedById: order.cancelRequestedById,
      listing: order.listing,
      provider: order.provider,
      booking: order.booking ? { startsAt: iso(order.booking.startsAt), endsAt: iso(order.booking.endsAt) } : null,
      payments: order.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount.toString(),
        method: payment.method,
        reference: payment.reference,
        paidAt: iso(payment.paidAt),
        submittedById: payment.submittedById,
        buyerConfirmedAt: iso(payment.buyerConfirmedAt),
        providerConfirmedAt: iso(payment.providerConfirmedAt),
        refundAmount: decimal(payment.refundAmount),
        hasReceipt: Boolean(payment.receiptKey),
      })),
      commission: order.commission ? { status: order.commission.status, amount: order.commission.amount.toString() } : null,
      hasReview: Boolean(order.review),
    })),
    projects: projects.map((project) => ({
      id: project.id,
      title: project.title,
      projectType: project.projectType,
      district: project.district,
      description: project.description,
      approximateArea: project.approximateArea,
      budget: decimal(project.budget),
      startsAt: iso(project.startsAt),
      targetEndsAt: iso(project.targetEndsAt),
      status: project.status,
      orders: project.orders.map((order) => ({
        id: order.id,
        status: order.status,
        subtotal: order.subtotal.toString(),
        transportFee: order.transportFee.toString(),
        titleBn: order.listing.titleBn,
        titleEn: order.listing.titleEn,
        kind: order.listing.kind,
        providerNameBn: order.provider.nameBn,
        providerNameEn: order.provider.nameEn,
        payments: order.payments.map((payment) => ({ id: payment.id, amount: payment.amount.toString(), method: payment.method, reference: payment.reference, refundAmount: decimal(payment.refundAmount), confirmed: Boolean(payment.buyerConfirmedAt && payment.providerConfirmedAt), hasReceipt: Boolean(payment.receiptKey) })),
      })),
      requests: project.requests.map((request) => ({
        id: request.id,
        status: request.status,
        quantity: request.quantity.toString(),
        district: request.district,
        details: request.details,
        packageLabel: request.packageLabel,
        requestedStart: iso(request.requestedStart),
        requestedEnd: iso(request.requestedEnd),
        listing: request.listing,
        providerId: request.provider.id,
        providerNameBn: request.provider.nameBn,
        providerNameEn: request.provider.nameEn,
        quote: request.quote ? { id: request.quote.id, quantity: request.quote.quantity.toString(), unitPrice: request.quote.unitPrice.toString(), transportFee: request.quote.transportFee.toString(), note: request.quote.note, status: request.quote.status, expiresAt: iso(request.quote.expiresAt) } : null,
        order: request.order,
      })),
      milestones: project.milestones.map((milestone) => ({
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        amount: decimal(milestone.amount),
        dueAt: iso(milestone.dueAt),
        status: milestone.status,
      })),
      documents: project.documents.map((document) => ({ ...document, createdAt: iso(document.createdAt) })),
      expenses: project.expenses.map((expense) => ({ id: expense.id, description: expense.description, amount: expense.amount.toString(), occurredAt: iso(expense.occurredAt) })),
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      titleBn: notification.titleBn ?? notification.title,
      titleEn: notification.titleEn ?? notification.title,
      messageBn: notification.messageBn ?? notification.message,
      messageEn: notification.messageEn ?? notification.message,
      href: notification.href,
      readAt: iso(notification.readAt),
      createdAt: iso(notification.createdAt),
    })),
    agricultureRequests: agricultureRequests.map((request) => ({
      id: request.id,
      referenceCode: request.referenceCode,
      status: request.status,
      district: request.district,
      details: request.details,
      budget: decimal(request.budget),
      createdAt: iso(request.createdAt),
      service: request.serviceDefinition,
      updates: request.updates.map((update) => ({ id: update.id, messageBn: update.messageBn, messageEn: update.messageEn, createdAt: iso(update.createdAt) })),
      attachments: request.attachments,
    })),
  };
}

export async function getProviderWorkspace(userId: string) {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      capabilities: { orderBy: [{ sectorSlug: "asc" }, { kind: "asc" }] },
      listings: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!profile) return null;

  const [requests, orders, notifications, projectMilestones] = await Promise.all([
    prisma.marketplaceRequest.findMany({
      where: { providerId: profile.id, status: { in: ["OPEN", "QUOTED"] } },
      orderBy: { createdAt: "desc" },
      include: { buyer: { select: { name: true } }, listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true } }, quote: true },
    }),
    prisma.order.findMany({
      where: { providerId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        buyer: { select: { name: true, id: true } },
        listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true } },
        booking: true,
        payments: { orderBy: { createdAt: "desc" } },
        commission: true,
      },
    }),
    prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 30 }),
    prisma.projectMilestone.findMany({
      where: { project: { orders: { some: { providerId: profile.id } } } },
      orderBy: [{ dueAt: "asc" }, { createdAt: "asc" }],
      include: { project: { select: { id: true, title: true, district: true } } },
    }),
  ]);

  return {
    profile: {
      id: profile.id,
      nameBn: profile.nameBn,
      nameEn: profile.nameEn,
      bioBn: profile.bioBn,
      bioEn: profile.bioEn,
      district: profile.district,
      upazila: profile.upazila,
      status: profile.status,
    },
    capabilities: profile.capabilities.map((capability) => ({ id: capability.id, sectorSlug: capability.sectorSlug, kind: capability.kind, status: capability.status })),
    listings: profile.listings.map((listing) => ({
      id: listing.id,
      sectorSlug: listing.sectorSlug,
      kind: listing.kind,
      titleBn: listing.titleBn,
      titleEn: listing.titleEn,
      category: listing.category,
      district: listing.district,
      unit: listing.unit,
      unitPrice: listing.unitPrice.toString(),
      stock: listing.stock.toString(),
      moderationStatus: listing.moderationStatus,
      isPublished: listing.isPublished,
    })),
    requests: requests.map((request) => ({
      id: request.id,
      status: request.status,
      quantity: request.quantity.toString(),
      district: request.district,
      details: request.details,
      requestedStart: iso(request.requestedStart),
      requestedEnd: iso(request.requestedEnd),
      buyerName: request.buyer.name,
      listing: request.listing,
      quote: request.quote ? {
        id: request.quote.id,
        status: request.quote.status,
        quantity: request.quote.quantity.toString(),
        unitPrice: request.quote.unitPrice.toString(),
        transportFee: request.quote.transportFee.toString(),
        note: request.quote.note,
      } : null,
    })),
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      buyerId: order.buyer.id,
      buyerName: order.buyer.name,
      quantity: order.quantity.toString(),
      unit: order.unit,
      unitPrice: order.unitPrice.toString(),
      subtotal: order.subtotal.toString(),
      transportFee: order.transportFee.toString(),
      commissionAmount: order.commissionAmount.toString(),
      listing: order.listing,
      booking: order.booking ? { startsAt: iso(order.booking.startsAt), endsAt: iso(order.booking.endsAt) } : null,
      cancellationReason: order.cancellationReason,
      cancelRequestedById: order.cancelRequestedById,
      payments: order.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount.toString(),
        method: payment.method,
        reference: payment.reference,
        paidAt: iso(payment.paidAt),
        submittedById: payment.submittedById,
        buyerConfirmedAt: iso(payment.buyerConfirmedAt),
        providerConfirmedAt: iso(payment.providerConfirmedAt),
        hasReceipt: Boolean(payment.receiptKey),
      })),
      commission: order.commission ? { status: order.commission.status, amount: order.commission.amount.toString() } : null,
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      titleBn: notification.titleBn ?? notification.title,
      titleEn: notification.titleEn ?? notification.title,
      messageBn: notification.messageBn ?? notification.message,
      messageEn: notification.messageEn ?? notification.message,
      href: notification.href,
      createdAt: iso(notification.createdAt),
    })),
    projectMilestones: projectMilestones.map((milestone) => ({ id: milestone.id, title: milestone.title, description: milestone.description, amount: decimal(milestone.amount), dueAt: iso(milestone.dueAt), status: milestone.status, projectId: milestone.project.id, projectTitle: milestone.project.title, district: milestone.project.district })),
  };
}

export type AgricultureAdminFilters = {
  serviceSlug?: string;
  district?: string;
  status?: RequestStatus;
  assigneeId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export async function getAdminWorkspace(access: StaffAccess, agricultureFilters: AgricultureAdminFilters = {}) {
  const sectorSlugs = Array.from(new Set([...access.operationSectors, ...access.financeSectors]));
  const dateToExclusive = agricultureFilters.dateTo ? new Date(`${agricultureFilters.dateTo}T00:00:00.000Z`) : undefined;
  dateToExclusive?.setUTCDate(dateToExclusive.getUTCDate() + 1);
  const agricultureWhere = {
    serviceDefinition: { sectorSlug: "agriculture-labor", ...(agricultureFilters.serviceSlug ? { slug: agricultureFilters.serviceSlug } : {}) },
    ...(agricultureFilters.district ? { district: { contains: agricultureFilters.district, mode: "insensitive" as const } } : {}),
    ...(agricultureFilters.status ? { status: agricultureFilters.status } : {}),
    ...(agricultureFilters.assigneeId ? { assignedToId: agricultureFilters.assigneeId } : {}),
    ...((agricultureFilters.dateFrom || dateToExclusive) ? { createdAt: { ...(agricultureFilters.dateFrom ? { gte: new Date(`${agricultureFilters.dateFrom}T00:00:00.000Z`) } : {}), ...(dateToExclusive ? { lt: dateToExclusive } : {}) } } : {}),
  };
  const agricultureEnabled = access.operationSectors.includes("agriculture-labor");
  const [capabilities, listings, requests, disputes, commissions, paymentMismatches, sectors, staffGrants, agricultureRequests, agricultureStaff] = await Promise.all([
    access.operationSectors.length ? prisma.providerCapability.findMany({
      where: { status: "PENDING", sectorSlug: { in: access.operationSectors } },
      orderBy: { createdAt: "asc" },
      include: { sector: { select: { titleBn: true, titleEn: true } }, provider: { include: { user: { select: { name: true, email: true, phone: true } } } } },
    }) : Promise.resolve([]),
    access.operationSectors.length ? prisma.marketplaceListing.findMany({
      where: { moderationStatus: "PENDING", sectorSlug: { in: access.operationSectors } },
      orderBy: { createdAt: "asc" },
      include: { provider: { select: { nameBn: true, nameEn: true } } },
    }) : Promise.resolve([]),
    access.operationSectors.length ? prisma.marketplaceRequest.findMany({
      where: { status: { in: ["OPEN", "QUOTED"] }, sectorSlug: { in: access.operationSectors } },
      orderBy: { createdAt: "asc" },
      include: {
        buyer: { select: { name: true } },
        listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true } },
        provider: { select: { id: true, nameBn: true, nameEn: true } },
        project: { select: { title: true } },
        quote: { select: { quantity: true, unitPrice: true, transportFee: true } },
      },
    }) : Promise.resolve([]),
    access.operationSectors.length ? prisma.order.findMany({
      where: { status: "DISPUTED", request: { sectorSlug: { in: access.operationSectors } } },
      orderBy: { updatedAt: "asc" },
      include: { buyer: { select: { name: true } }, provider: { select: { nameBn: true, nameEn: true } }, listing: { select: { titleBn: true, titleEn: true } }, request: { select: { sectorSlug: true } } },
    }) : Promise.resolve([]),
    access.financeSectors.length ? prisma.commissionRecord.findMany({
      where: { status: "DUE", order: { request: { sectorSlug: { in: access.financeSectors } } } },
      orderBy: { order: { createdAt: "asc" } },
      include: { order: { include: { buyer: { select: { name: true } }, provider: { select: { nameBn: true, nameEn: true } }, listing: { select: { titleBn: true, titleEn: true } }, request: { select: { sectorSlug: true } } } } },
    }) : Promise.resolve([]),
    access.financeSectors.length ? prisma.paymentRecord.findMany({
      where: {
        OR: [{ buyerConfirmedAt: null }, { providerConfirmedAt: null }],
        order: { request: { sectorSlug: { in: access.financeSectors } } },
      },
      orderBy: { createdAt: "asc" },
      include: { order: { include: { buyer: { select: { name: true } }, provider: { select: { nameBn: true, nameEn: true } }, listing: { select: { titleBn: true, titleEn: true } }, request: { select: { sectorSlug: true } } } } },
    }) : Promise.resolve([]),
    sectorSlugs.length ? prisma.sector.findMany({ where: { slug: { in: sectorSlugs } }, orderBy: { position: "asc" } }) : Promise.resolve([]),
    access.isSuperAdmin ? prisma.staffGrant.findMany({ orderBy: [{ permission: "asc" }, { scopeKey: "asc" }], include: { user: { select: { name: true, email: true } } } }) : Promise.resolve([]),
    agricultureEnabled ? prisma.serviceRequest.findMany({
      where: agricultureWhere,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        serviceDefinition: { select: { slug: true, titleBn: true, titleEn: true, icon: true } },
        user: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
        updates: { orderBy: { createdAt: "desc" }, take: 10 },
        attachments: { select: { id: true, filename: true, sizeBytes: true } },
        marketplaceRequest: { select: { id: true, listing: { select: { titleBn: true, titleEn: true } } } },
      },
    }) : Promise.resolve([]),
    agricultureEnabled ? prisma.user.findMany({
      where: { status: "active", OR: [{ role: "super_admin" }, { staffGrants: { some: { permission: "OPERATIONS", scopeKey: { in: ["global", "agriculture-labor"] } } } }] },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }) : Promise.resolve([]),
  ]);

  return {
    capabilities: capabilities.map((capability) => ({
      id: capability.id,
      sectorSlug: capability.sectorSlug,
      sectorTitleBn: capability.sector.titleBn,
      sectorTitleEn: capability.sector.titleEn,
      kind: capability.kind,
      providerId: capability.provider.id,
      nameBn: capability.provider.nameBn,
      nameEn: capability.provider.nameEn,
      district: capability.provider.district,
      bioBn: capability.provider.bioBn,
      bioEn: capability.provider.bioEn,
      userName: capability.provider.user.name,
      email: capability.provider.user.email,
      phone: capability.provider.user.phone,
      createdAt: iso(capability.createdAt),
    })),
    listings: listings.map((listing) => ({
      id: listing.id,
      sectorSlug: listing.sectorSlug,
      kind: listing.kind,
      titleBn: listing.titleBn,
      titleEn: listing.titleEn,
      category: listing.category,
      district: listing.district,
      unit: listing.unit,
      unitPrice: listing.unitPrice.toString(),
      stock: listing.stock.toString(),
      providerNameBn: listing.provider.nameBn,
      providerNameEn: listing.provider.nameEn,
    })),
    requests: requests.map((request) => ({
      id: request.id,
      sectorSlug: request.sectorSlug,
      status: request.status,
      buyerName: request.buyer.name,
      providerId: request.provider.id,
      providerNameBn: request.provider.nameBn,
      providerNameEn: request.provider.nameEn,
      titleBn: request.listing.titleBn,
      titleEn: request.listing.titleEn,
      kind: request.listing.kind,
      unit: request.listing.unit,
      quantity: request.quantity.toString(),
      district: request.district,
      details: request.details,
      packageLabel: request.packageLabel,
      projectTitle: request.project?.title ?? null,
      requestedStart: iso(request.requestedStart),
      requestedEnd: iso(request.requestedEnd),
      createdAt: iso(request.createdAt),
      quote: request.quote ? {
        quantity: request.quote.quantity.toString(),
        unitPrice: request.quote.unitPrice.toString(),
        transportFee: request.quote.transportFee.toString(),
      } : null,
    })),
    disputes: disputes.map((order) => ({
      id: order.id,
      sectorSlug: order.request.sectorSlug,
      titleBn: order.listing.titleBn,
      titleEn: order.listing.titleEn,
      buyerName: order.buyer.name,
      providerNameBn: order.provider.nameBn,
      providerNameEn: order.provider.nameEn,
      subtotal: order.subtotal.toString(),
      cancellationReason: order.cancellationReason,
    })),
    commissions: commissions.map((commission) => ({
      id: commission.id,
      amount: commission.amount.toString(),
      sectorSlug: commission.order.request.sectorSlug,
      titleBn: commission.order.listing.titleBn,
      titleEn: commission.order.listing.titleEn,
      buyerName: commission.order.buyer.name,
      providerNameBn: commission.order.provider.nameBn,
      providerNameEn: commission.order.provider.nameEn,
    })),
    paymentMismatches: paymentMismatches.map((payment) => ({
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount.toString(),
      reference: payment.reference,
      buyerConfirmed: Boolean(payment.buyerConfirmedAt),
      providerConfirmed: Boolean(payment.providerConfirmedAt),
      hasReceipt: Boolean(payment.receiptKey),
      sectorSlug: payment.order.request.sectorSlug,
      titleBn: payment.order.listing.titleBn,
      titleEn: payment.order.listing.titleEn,
      buyerName: payment.order.buyer.name,
      providerNameBn: payment.order.provider.nameBn,
      providerNameEn: payment.order.provider.nameEn,
    })),
    sectors: sectors.map((sector) => ({ slug: sector.slug, titleBn: sector.titleBn, titleEn: sector.titleEn, commissionRate: sector.commissionRate.toString() })),
    staffGrants: staffGrants.map((grant) => ({ id: grant.id, name: grant.user.name, email: grant.user.email, permission: grant.permission, scopeKey: grant.scopeKey })),
    agricultureRequests: agricultureRequests.map((request) => ({
      id: request.id,
      referenceCode: request.referenceCode,
      customerName: request.customerName,
      customerEmail: request.user?.email ?? "",
      phone: request.phone,
      district: request.district,
      details: request.details,
      budget: decimal(request.budget),
      status: request.status,
      createdAt: iso(request.createdAt),
      service: request.serviceDefinition,
      answers: request.answers,
      fieldSnapshot: request.fieldSnapshot,
      assignedTo: request.assignedTo,
      userId: request.userId,
      updates: request.updates.map((update) => ({ id: update.id, visibility: update.visibility, messageBn: update.messageBn, messageEn: update.messageEn, createdAt: iso(update.createdAt) })),
      attachments: request.attachments,
      marketplaceRequest: request.marketplaceRequest,
    })),
    agricultureStaff,
    agricultureFilters,
    access,
  };
}

export async function getCustomerAgricultureRequest(userId: string, requestId: number) {
  const request = await prisma.serviceRequest.findFirst({
    where: { id: requestId, userId, serviceDefinition: { sectorSlug: "agriculture-labor" } },
    include: {
      serviceDefinition: { select: { slug: true, titleBn: true, titleEn: true, icon: true } },
      updates: { where: { visibility: "CUSTOMER" }, orderBy: { createdAt: "asc" } },
      attachments: { select: { id: true, filename: true, contentType: true, sizeBytes: true, createdAt: true } },
    },
  });
  if (!request) return null;
  return {
    id: request.id,
    referenceCode: request.referenceCode,
    status: request.status,
    customerName: request.customerName,
    phone: request.phone,
    district: request.district,
    details: request.details,
    budget: decimal(request.budget),
    answers: request.answers,
    fieldSnapshot: request.fieldSnapshot,
    createdAt: iso(request.createdAt),
    service: request.serviceDefinition,
    updates: request.updates.map((update) => ({ id: update.id, messageBn: update.messageBn, messageEn: update.messageEn, createdAt: iso(update.createdAt) })),
    attachments: request.attachments.map((attachment) => ({ ...attachment, createdAt: iso(attachment.createdAt) })),
  };
}

export async function getProjectWorkspace(userId: string, projectId: string) {
  const access = await prisma.constructionProject.findUnique({ where: { id: projectId }, select: { id: true, ownerId: true } });
  if (!access) return null;
  const isOwner = access.ownerId === userId;
  let providerId: string | null = null;
  if (!isOwner) {
    const profile = await prisma.providerProfile.findUnique({ where: { userId }, select: { id: true, status: true } });
    if (!profile || profile.status !== "APPROVED") return null;
    providerId = profile.id;
    const invited = await prisma.marketplaceRequest.findFirst({ where: { projectId, providerId }, select: { id: true } });
    const engaged = await prisma.order.findFirst({ where: { projectId, providerId }, select: { id: true } });
    if (!invited && !engaged) return null;
  }

  const project = await prisma.constructionProject.findUnique({
    where: { id: projectId },
    include: {
      owner: { select: { name: true } },
      requests: {
        ...(isOwner ? {} : { where: { providerId: providerId ?? undefined } }),
        orderBy: { createdAt: "desc" },
        include: {
          listing: { select: { titleBn: true, titleEn: true, kind: true, unit: true } },
          provider: { select: { id: true, nameBn: true, nameEn: true } },
          quote: true,
          order: { select: { id: true, status: true } },
        },
      },
      orders: {
        ...(isOwner ? {} : { where: { providerId: providerId ?? undefined } }),
        orderBy: { createdAt: "desc" },
        include: { listing: { select: { titleBn: true, titleEn: true, kind: true } }, provider: { select: { nameBn: true, nameEn: true } }, payments: { orderBy: { createdAt: "desc" } } },
      },
      milestones: { orderBy: { createdAt: "asc" } },
      documents: { select: { id: true, filename: true, contentType: true, sizeBytes: true, createdAt: true } },
      expenses: { orderBy: { occurredAt: "desc" } },
    },
  });
  if (!project) return null;
  return {
    id: project.id,
    ownerId: project.ownerId,
    isOwner,
    ownerName: project.owner.name,
    title: project.title,
    projectType: project.projectType,
    district: project.district,
    description: project.description,
    approximateArea: project.approximateArea,
    budget: decimal(project.budget),
    startsAt: iso(project.startsAt),
    targetEndsAt: iso(project.targetEndsAt),
    status: project.status,
    requests: project.requests.map((request) => ({
      id: request.id,
      status: request.status,
      quantity: request.quantity.toString(),
      district: request.district,
      details: request.details,
      packageLabel: request.packageLabel,
      requestedStart: iso(request.requestedStart),
      requestedEnd: iso(request.requestedEnd),
      listing: request.listing,
      providerId: request.provider.id,
      providerNameBn: request.provider.nameBn,
      providerNameEn: request.provider.nameEn,
      quote: request.quote ? {
        id: request.quote.id,
        status: request.quote.status,
        quantity: request.quote.quantity.toString(),
        unitPrice: request.quote.unitPrice.toString(),
        transportFee: request.quote.transportFee.toString(),
        note: request.quote.note,
        expiresAt: iso(request.quote.expiresAt),
      } : null,
      order: request.order,
    })),
    orders: project.orders.map((order) => ({
      id: order.id,
      status: order.status,
      subtotal: order.subtotal.toString(),
      transportFee: order.transportFee.toString(),
      titleBn: order.listing.titleBn,
      titleEn: order.listing.titleEn,
      kind: order.listing.kind,
      providerNameBn: order.provider.nameBn,
      providerNameEn: order.provider.nameEn,
      payments: order.payments.map((payment) => ({ id: payment.id, amount: payment.amount.toString(), method: payment.method, reference: payment.reference, refundAmount: decimal(payment.refundAmount), confirmed: Boolean(payment.buyerConfirmedAt && payment.providerConfirmedAt), hasReceipt: Boolean(payment.receiptKey) })),
    })),
    milestones: project.milestones.map((milestone) => ({ id: milestone.id, title: milestone.title, description: milestone.description, amount: decimal(milestone.amount), dueAt: iso(milestone.dueAt), status: milestone.status })),
    documents: project.documents.map((document) => ({ id: document.id, filename: document.filename, contentType: document.contentType, sizeBytes: document.sizeBytes, createdAt: iso(document.createdAt) })),
    expenses: isOwner ? project.expenses.map((expense) => ({ id: expense.id, description: expense.description, amount: expense.amount.toString(), occurredAt: iso(expense.occurredAt) })) : [],
  };
}

export type CustomerWorkspace = Awaited<ReturnType<typeof getCustomerWorkspace>>;
export type ProviderWorkspace = NonNullable<Awaited<ReturnType<typeof getProviderWorkspace>>>;
export type AdminWorkspace = Awaited<ReturnType<typeof getAdminWorkspace>>;
export type ProjectWorkspace = NonNullable<Awaited<ReturnType<typeof getProjectWorkspace>>>;
