import "server-only";

import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProjectInput, MilestoneInput } from "@/lib/validations/workflows";
import { WorkflowError } from "@/lib/domain/marketplace";
import { validateStoredObject } from "@/lib/storage/s3";

function dateAtUtcStart(date: string) {
  return new Date(`${date}T00:00:00.000Z`);
}

export async function attachProjectDocument(actorId: string, input: { projectId: string; storageKey: string; filename: string; sizeBytes: string }) {
  const project = await prisma.constructionProject.findFirst({ where: { id: input.projectId, ownerId: actorId }, select: { id: true } });
  if (!project || !input.storageKey.startsWith(`projects/${project.id}/${actorId}/`)) throw new WorkflowError(project ? "notAllowed" : "notFound");
  await validateStoredObject(input.storageKey, "application/pdf", 10_000_000, Number(input.sizeBytes));

  const filename = input.filename.replace(/[\\/\0-\x1f\x7f]/g, "_").trim().slice(0, 120);
  if (!filename) throw new WorkflowError("invalidState");
  const document = await prisma.projectDocument.create({
    data: { projectId: project.id, uploadedById: actorId, filename, storageKey: input.storageKey, contentType: "application/pdf", sizeBytes: Number(input.sizeBytes) },
    select: { id: true },
  });
  await prisma.activityLog.create({ data: { userId: actorId, action: "project.document_attached", entityType: "project_document", entityId: document.id } });
  return document;
}

export async function createConstructionProject(actorId: string, input: CreateProjectInput) {
  const sector = await prisma.sector.findUnique({ where: { slug: "construction" }, select: { status: true } });
  if (!sector || sector.status !== "LIVE") throw new WorkflowError("unavailable");

  const project = await prisma.constructionProject.create({
    data: {
      ownerId: actorId,
      title: input.title,
      projectType: input.projectType,
      district: input.district,
      description: input.description,
      approximateArea: input.approximateArea || null,
      budget: input.budget ? new Prisma.Decimal(input.budget) : null,
      startsAt: input.startsAt ? dateAtUtcStart(input.startsAt) : null,
      targetEndsAt: input.targetEndsAt ? dateAtUtcStart(input.targetEndsAt) : null,
    },
    select: { id: true },
  });
  await prisma.activityLog.create({ data: { userId: actorId, action: "project.created", entityType: "project", entityId: project.id } });
  return project;
}

export async function recordProjectExpense(actorId: string, input: { projectId: string; description: string; amount: string; occurredAt?: string }) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.constructionProject.findUnique({ where: { id: input.projectId }, select: { id: true, ownerId: true, status: true } });
    if (!project) throw new WorkflowError("notFound");
    if (project.ownerId !== actorId) throw new WorkflowError("notAllowed");
    if (project.status === "CANCELLED") throw new WorkflowError("invalidState");
    const expense = await tx.projectExpense.create({
      data: {
        projectId: project.id,
        createdById: actorId,
        description: input.description,
        amount: new Prisma.Decimal(input.amount),
        occurredAt: input.occurredAt ? dateAtUtcStart(input.occurredAt) : new Date(),
      },
      select: { id: true },
    });
    await tx.activityLog.create({ data: { userId: actorId, action: "project.expense_recorded", entityType: "project_expense", entityId: expense.id } });
    return expense;
  });
}

export async function addProjectMilestone(actorId: string, input: MilestoneInput) {
  return prisma.$transaction(async (tx) => {
    const project = await tx.constructionProject.findUnique({ where: { id: input.projectId }, select: { id: true, ownerId: true, status: true } });
    if (!project) throw new WorkflowError("notFound");
    if (project.ownerId !== actorId) throw new WorkflowError("notAllowed");
    if (project.status !== "PLANNING" && project.status !== "ACTIVE") throw new WorkflowError("invalidState");

    const milestone = await tx.projectMilestone.create({
      data: {
        projectId: project.id,
        title: input.title,
        description: input.description,
        amount: input.amount ? new Prisma.Decimal(input.amount) : null,
        dueAt: input.dueAt ? dateAtUtcStart(input.dueAt) : null,
      },
      select: { id: true },
    });
    await tx.activityLog.create({ data: { userId: actorId, action: "project.milestone_created", entityType: "milestone", entityId: milestone.id } });
    return milestone;
  });
}

export async function updateProjectMilestone(actorId: string, milestoneId: string, intent: "submit" | "approve") {
  return prisma.$transaction(async (tx) => {
    const milestone = await tx.projectMilestone.findUnique({
      where: { id: milestoneId },
      select: {
        id: true,
        status: true,
        project: {
          select: {
            id: true,
            ownerId: true,
            orders: { select: { provider: { select: { userId: true } } } },
          },
        },
      },
    });
    if (!milestone) throw new WorkflowError("notFound");
    const isOwner = milestone.project.ownerId === actorId;
    const isEngagedProvider = milestone.project.orders.some((order) => order.provider.userId === actorId);

    if (intent === "submit") {
      if (!isEngagedProvider || !["PENDING", "IN_PROGRESS"].includes(milestone.status)) throw new WorkflowError("notAllowed");
      await tx.projectMilestone.update({ where: { id: milestone.id }, data: { status: "REVIEW" } });
      await tx.notification.create({
        data: {
          userId: milestone.project.ownerId,
          title: "Milestone ready for review",
          message: "A provider submitted a project milestone for approval.",
          titleBn: "প্রকল্পের ধাপ পর্যালোচনার জন্য প্রস্তুত",
          titleEn: "Milestone ready for review",
          messageBn: "একজন সেবাদাতা প্রকল্পের একটি ধাপ অনুমোদনের জন্য পাঠিয়েছেন।",
          messageEn: "A provider submitted a project milestone for approval.",
          href: `/account/projects/${milestone.project.id}`,
        },
      });
    } else {
      if (!isOwner || milestone.status !== "REVIEW") throw new WorkflowError("notAllowed");
      await tx.projectMilestone.update({ where: { id: milestone.id }, data: { status: "APPROVED" } });
      const providerIds = await tx.order.findMany({
        where: { projectId: milestone.project.id },
        select: { provider: { select: { userId: true } } },
        distinct: ["providerId"],
      });
      for (const provider of providerIds) {
        await tx.notification.create({
          data: {
            userId: provider.provider.userId,
            title: "Milestone approved",
            message: "The customer approved a project milestone.",
            titleBn: "প্রকল্পের ধাপ অনুমোদিত",
            titleEn: "Milestone approved",
            messageBn: "গ্রাহক প্রকল্পের একটি ধাপ অনুমোদন করেছেন।",
            messageEn: "The customer approved a project milestone.",
            href: "/provider#orders",
          },
        });
      }
    }
    await tx.activityLog.create({ data: { userId: actorId, action: `project.milestone_${intent}`, entityType: "milestone", entityId: milestone.id } });
  });
}
