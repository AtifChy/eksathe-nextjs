"use client";

import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { addMilestoneAction, attachProjectDocumentAction, createProjectAction, updateMilestoneAction } from "@/app/actions/projects";
import { uploadPrivateFile } from "@/lib/client-upload";
import { useLanguage } from "@/components/language-provider";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialWorkflowState } from "@/lib/workflow-state";

export function CreateProjectForm() {
  const [state, action, pending] = useActionState(createProjectAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-2">
      <Field id="project-title" label={t.workflow.projectTitle}><Input id="project-title" name="title" maxLength={120} required /></Field>
      <Field id="project-type" label={t.workflow.projectType}><Input id="project-type" name="projectType" placeholder={locale === "bn" ? "বাড়ি, দোকান, সংস্কার" : "House, shop, renovation"} maxLength={80} required /></Field>
      <Field id="project-district" label={t.workflow.district}><Input id="project-district" name="district" maxLength={80} required /></Field>
      <Field id="project-area" label={t.workflow.approximateArea}><Input id="project-area" name="approximateArea" maxLength={80} /></Field>
      <Field id="project-budget" label={t.workflow.budget}><Input id="project-budget" name="budget" type="number" min="0" step="0.01" /></Field>
      <Field id="project-start" label={t.workflow.startDate}><Input id="project-start" name="startsAt" type="date" /></Field>
      <Field id="project-end" label={t.workflow.endDate}><Input id="project-end" name="targetEndsAt" type="date" /></Field>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="project-description">{t.workflow.projectDescription}</Label>
        <textarea id="project-description" name="description" required maxLength={4000} rows={5} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2"><ActionFeedback state={state} /><Button type="submit" disabled={pending}>{pending ? t.common.loading : t.workflow.createProject}</Button></div>
    </form>
  );
}

export function AddMilestoneForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(addMilestoneAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return (
    <form action={action} className="grid gap-3 rounded-xl border border-border/70 p-4 sm:grid-cols-2">
      <input type="hidden" name="projectId" value={projectId} />
      <Field id={`milestone-title-${projectId}`} label={t.workflow.milestoneTitle}><Input id={`milestone-title-${projectId}`} name="title" required maxLength={120} /></Field>
      <Field id={`milestone-amount-${projectId}`} label={t.workflow.budget}><Input id={`milestone-amount-${projectId}`} name="amount" type="number" min="0" step="0.01" /></Field>
      <Field id={`milestone-due-${projectId}`} label={locale === "bn" ? "শেষ তারিখ" : "Due date"}><Input id={`milestone-due-${projectId}`} name="dueAt" type="date" /></Field>
      <Field id={`milestone-description-${projectId}`} label={t.workflow.milestoneDescription}><Input id={`milestone-description-${projectId}`} name="description" maxLength={1200} /></Field>
      <div className="flex flex-col gap-2 sm:col-span-2"><ActionFeedback state={state} /><Button type="submit" variant="outline" disabled={pending}>{pending ? t.common.loading : t.workflow.addMilestone}</Button></div>
    </form>
  );
}

export function MilestoneStatusForm({ milestoneId, intent }: { milestoneId: string; intent: "submit" | "approve" }) {
  const [state, action, pending] = useActionState(updateMilestoneAction, initialWorkflowState);
  const { t } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="milestoneId" value={milestoneId} /><input type="hidden" name="intent" value={intent} /><ActionFeedback state={state} /><Button type="submit" variant="outline" size="sm" disabled={pending}>{pending ? t.common.loading : intent === "submit" ? t.workflow.completeWork : t.workflow.approveMilestone}</Button></form>;
}

export function ProjectDocumentUploadForm({ projectId }: { projectId: string }) {
  const [state, action, pending] = useActionState(attachProjectDocumentAction, initialWorkflowState);
  const { t } = useLanguage();
  const [uploadError, setUploadError] = useState<"uploadFailed" | "invalidUpload" | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadedFile = useRef<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    uploadedFile.current = null;
  }, [state.status]);

  async function prepareDocument(event: FormEvent<HTMLFormElement>) {
    const selectedFile = fileInput.current?.files?.[0] ?? null;
    if (selectedFile && uploadedFile.current === selectedFile) return;
    event.preventDefault();
    if (!selectedFile) {
      setUploadError("invalidUpload");
      return;
    }
    const form = event.currentTarget;
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadPrivateFile(selectedFile, { purpose: "project-document", projectId });
      const keyField = form.elements.namedItem("storageKey");
      const filenameField = form.elements.namedItem("filename");
      const sizeField = form.elements.namedItem("sizeBytes");
      if (keyField instanceof HTMLInputElement) keyField.value = result.key;
      if (filenameField instanceof HTMLInputElement) filenameField.value = selectedFile.name;
      if (sizeField instanceof HTMLInputElement) sizeField.value = result.sizeBytes;
      uploadedFile.current = selectedFile;
      form.requestSubmit();
    } catch (error) {
      setUploadError(error instanceof Error && error.message === "invalid-file" ? "invalidUpload" : "uploadFailed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form ref={formRef} action={action} onSubmit={prepareDocument} className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="storageKey" defaultValue="" />
      <input type="hidden" name="filename" defaultValue="" />
      <input type="hidden" name="sizeBytes" defaultValue="" />
      <Input ref={fileInput} type="file" accept="application/pdf,.pdf" disabled={uploading || pending} onChange={(event) => { setUploadError(null); uploadedFile.current = null; const form = event.currentTarget.form; for (const name of ["storageKey", "filename", "sizeBytes"]) { const field = form?.elements.namedItem(name); if (field instanceof HTMLInputElement) field.value = ""; } }} aria-label={t.workflow.projectDocuments} />
      {uploadError && <p role="alert" className="text-sm text-destructive">{t.workflow[uploadError]}</p>}
      <ActionFeedback state={state} />
      <Button type="submit" variant="outline" disabled={pending || uploading}>{pending || uploading ? t.common.loading : t.workflow.attachDocument}</Button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
