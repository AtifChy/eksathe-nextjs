import type { Dictionary } from "@/dictionaries/types";

export type WorkflowMessageKey = keyof Dictionary["workflow"];
export type WorkflowState = {
  status: "idle" | "success" | "error";
  messageKey?: WorkflowMessageKey;
  entityId?: string;
  referenceCode?: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialWorkflowState: WorkflowState = { status: "idle" };
