import messages from "../../messages/en.json";

export type WorkflowMessageKey = keyof typeof messages.workflow;
export type WorkflowState = {
  status: "idle" | "success" | "error";
  messageKey?: WorkflowMessageKey;
  entityId?: string;
  referenceCode?: string;
  errors?: Record<string, string[] | undefined>;
};

export const initialWorkflowState: WorkflowState = { status: "idle" };
