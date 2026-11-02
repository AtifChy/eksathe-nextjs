"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addProjectMilestone, attachProjectDocument, createConstructionProject, recordProjectExpense, updateProjectMilestone } from "@/lib/domain/projects";
import { WorkflowError } from "@/lib/domain/marketplace";
import { requireUser } from "@/lib/dal";
import { attachProjectDocumentSchema, createProjectSchema, milestoneSchema, milestoneUpdateSchema, projectExpenseSchema } from "@/lib/validations/workflows";
import type { WorkflowMessageKey, WorkflowState } from "@/lib/workflow-state";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function fail(error: unknown): WorkflowState {
  if (error instanceof z.ZodError) return { status: "error", messageKey: "validationError", errors: z.flattenError(error).fieldErrors };
  if (error instanceof WorkflowError) {
    const keys: Record<WorkflowError["code"], WorkflowMessageKey> = {
      notFound: "listingMissing",
      notAllowed: "permissionDenied",
      invalidState: "requestFailed",
      unavailable: "listingMissing",
      stockUnavailable: "stockUnavailable",
      bookingUnavailable: "bookingUnavailable",
      amountMismatch: "amountMismatch",
    };
    return { status: "error", messageKey: keys[error.code] };
  }
  console.error("Project action failed.", error);
  return { status: "error", messageKey: "requestFailed" };
}

async function run<T extends { id: string }>(operation: () => Promise<T>, key: WorkflowMessageKey, refresh: string[]): Promise<WorkflowState> {
  try {
    const result = await operation();
    refresh.forEach((path) => revalidatePath(path));
    return { status: "success", messageKey: key, entityId: result.id };
  } catch (error) {
    return fail(error);
  }
}

export async function createProjectAction(_state: WorkflowState, formData: FormData): Promise<WorkflowState> {
  const user = await requireUser("/account/projects/new");
  const rawBudget = value(formData, "budget");
  const rawStartsAt = value(formData, "startsAt");
  const rawTargetEndsAt = value(formData, "targetEndsAt");
  const parsed = createProjectSchema.safeParse({
    title: value(formData, "title"),
    projectType: value(formData, "projectType"),
    district: value(formData, "district"),
    description: value(formData, "description"),
    approximateArea: value(formData, "approximateArea"),
    ...(rawBudget ? { budget: rawBudget } : {}),
    ...(rawStartsAt ? { startsAt: rawStartsAt } : {}),
    ...(rawTargetEndsAt ? { targetEndsAt: rawTargetEndsAt } : {}),
  });
  if (!parsed.success) return fail(parsed.error);
  return run(() => createConstructionProject(user.id, parsed.data), "projectCreated", ["/account", "/dashboard/construction"]);
}

export async function addMilestoneAction(_state: WorkflowState, formData: FormData): Promise<WorkflowState> {
  const user = await requireUser("/account#projects");
  const rawAmount = value(formData, "amount");
  const rawDueAt = value(formData, "dueAt");
  const parsed = milestoneSchema.safeParse({
    projectId: value(formData, "projectId"),
    title: value(formData, "title"),
    description: value(formData, "description"),
    ...(rawAmount ? { amount: rawAmount } : {}),
    ...(rawDueAt ? { dueAt: rawDueAt } : {}),
  });
  if (!parsed.success) return fail(parsed.error);
  return run(() => addProjectMilestone(user.id, parsed.data), "milestoneAdded", ["/account", "/provider"]);
}

export async function updateMilestoneAction(_state: WorkflowState, formData: FormData): Promise<WorkflowState> {
  const user = await requireUser("/account#projects");
  const parsed = milestoneUpdateSchema.safeParse({ milestoneId: value(formData, "milestoneId"), intent: value(formData, "intent") });
  if (!parsed.success) return fail(parsed.error);
  return run(
    () => updateProjectMilestone(user.id, parsed.data.milestoneId, parsed.data.intent).then(() => ({ id: parsed.data.milestoneId })),
    parsed.data.intent === "submit" ? "milestoneSubmitted" : "milestoneApproved",
    ["/account", "/provider"],
  );
}

export async function attachProjectDocumentAction(_state: WorkflowState, formData: FormData): Promise<WorkflowState> {
  const projectId = value(formData, "projectId");
  const user = await requireUser(`/account/projects/${encodeURIComponent(projectId)}`);
  const parsed = attachProjectDocumentSchema.safeParse({
    projectId,
    storageKey: value(formData, "storageKey"),
    filename: value(formData, "filename"),
    sizeBytes: value(formData, "sizeBytes"),
  });
  if (!parsed.success) return fail(parsed.error);
  return run(() => attachProjectDocument(user.id, parsed.data), "documentUploaded", ["/account", `/account/projects/${projectId}`, "/provider"]);
}

export async function recordProjectExpenseAction(_state: WorkflowState, formData: FormData): Promise<WorkflowState> {
  const projectId = value(formData, "projectId");
  const user = await requireUser(`/account/projects/${encodeURIComponent(projectId)}`);
  const rawDate = value(formData, "occurredAt");
  const parsed = projectExpenseSchema.safeParse({
    projectId,
    description: value(formData, "description"),
    amount: value(formData, "amount"),
    ...(rawDate ? { occurredAt: rawDate } : {}),
  });
  if (!parsed.success) return fail(parsed.error);
  return run(() => recordProjectExpense(user.id, parsed.data), "expenseRecorded", ["/account", `/account/projects/${projectId}`]);
}
