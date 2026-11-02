"use client";

import { type FormEvent, useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createListingAction } from "@/app/actions/marketplace";
import { uploadPrivateFile } from "@/lib/client-upload";
import { useLanguage } from "@/components/language-provider";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agricultureListings, constructionListings } from "@/lib/sectors";
import { initialWorkflowState } from "@/lib/workflow-state";

type Capability = { sectorSlug: string; kind: string };
const services = [
  ...agricultureListings.map((service) => ({ ...service, sectorSlug: "agriculture-labor" })),
  ...constructionListings.map((service) => ({ ...service, sectorSlug: "construction" })),
];

export function ListingForm({ capabilities }: { capabilities: Capability[] }) {
  const [state, action, pending] = useActionState(createListingAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  const [sectorSlug, setSectorSlug] = useState(capabilities[0]?.sectorSlug ?? "agriculture-labor");
  const [uploadError, setUploadError] = useState<"uploadFailed" | "invalidUpload" | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadedFile = useRef<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sectorOptions = useMemo(() => Array.from(new Set(capabilities.map((item) => item.sectorSlug))), [capabilities]);
  const serviceOptions = services.filter((service) => service.sectorSlug === sectorSlug && capabilities.some((item) => item.sectorSlug === service.sectorSlug && item.kind === service.kind));

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    uploadedFile.current = null;
  }, [state.status]);

  async function prepareListingImage(event: FormEvent<HTMLFormElement>) {
    const selectedFile = fileInput.current?.files?.[0] ?? null;
    if (!selectedFile || uploadedFile.current === selectedFile) return;
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setUploading(true);
    setUploadError(null);
    try {
      const result = await uploadPrivateFile(selectedFile, {
        purpose: "listing-image",
        sectorSlug,
        kind: String(formData.get("kind") ?? ""),
      });
      const keyField = form.elements.namedItem("imageKey");
      const typeField = form.elements.namedItem("imageContentType");
      const sizeField = form.elements.namedItem("imageSizeBytes");
      if (keyField instanceof HTMLInputElement) keyField.value = result.key;
      if (typeField instanceof HTMLInputElement) typeField.value = result.contentType;
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
    <form ref={formRef} action={action} onSubmit={prepareListingImage} className="flex flex-col gap-4 rounded-xl border border-border/70 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="listing-sector" label={locale === "bn" ? "সেবা বিভাগ" : "Service sector"}>
          <select id="listing-sector" name="sectorSlug" value={sectorSlug} onChange={(event) => setSectorSlug(event.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
            {sectorOptions.map((sector) => <option key={sector} value={sector}>{sector === "construction" ? t.home.construction : t.home.agriculture}</option>)}
          </select>
        </Field>
        <Field id="listing-kind" label={t.workflow.category}>
          <select id="listing-kind" name="kind" required className="h-9 rounded-lg border border-input bg-background px-3 text-sm">
            {serviceOptions.map((service) => <option key={service.kind} value={service.kind}>{locale === "bn" ? service.titleBn : service.titleEn}</option>)}
          </select>
        </Field>
        <Field id="listing-title-bn" label={t.workflow.titleBn}><Input id="listing-title-bn" name="titleBn" required maxLength={120} /></Field>
        <Field id="listing-title-en" label={t.workflow.titleEn}><Input id="listing-title-en" name="titleEn" required maxLength={120} /></Field>
        <Field id="listing-category" label={t.workflow.category}><Input id="listing-category" name="category" required maxLength={80} placeholder={locale === "bn" ? "যেমন: সবজি, ইট, রাজমিস্ত্রি" : "e.g. vegetables, bricks, masonry"} /></Field>
        <Field id="listing-district" label={t.workflow.district}><Input id="listing-district" name="district" required maxLength={80} /></Field>
        <Field id="listing-unit" label={t.workflow.unit}><Input id="listing-unit" name="unit" required maxLength={30} placeholder={locale === "bn" ? "কেজি, দিন, বস্তা" : "kg, day, bag"} /></Field>
        <Field id="listing-unit-price" label={t.workflow.price}><Input id="listing-unit-price" name="unitPrice" type="number" min="0.01" step="0.01" required /></Field>
        <Field id="listing-stock" label={t.workflow.stock}><Input id="listing-stock" name="stock" type="number" min="0.001" step="0.001" defaultValue="1" required /></Field>
        <Field id="listing-available-from" label={locale === "bn" ? "উপলভ্যতার তারিখ" : "Available from (optional)"}><Input id="listing-available-from" name="availableFrom" type="date" /></Field>
      </div>
      <Field id="listing-description-bn" label={t.workflow.descriptionBn}><textarea id="listing-description-bn" name="descriptionBn" rows={3} maxLength={2000} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></Field>
      <Field id="listing-description-en" label={t.workflow.descriptionEn}><textarea id="listing-description-en" name="descriptionEn" rows={3} maxLength={2000} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></Field>
      <Field id="listing-image" label={t.workflow.listingImage}>
        <Input ref={fileInput} id="listing-image" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || pending} onChange={(event) => { setUploadError(null); uploadedFile.current = null; const form = event.currentTarget.form; for (const name of ["imageKey", "imageContentType", "imageSizeBytes"]) { const field = form?.elements.namedItem(name); if (field instanceof HTMLInputElement) field.value = ""; } }} />
      </Field>
      <p className="text-xs text-muted-foreground">{t.workflow.listingImageHelp}</p>
      <input type="hidden" name="imageKey" defaultValue="" />
      <input type="hidden" name="imageContentType" defaultValue="" />
      <input type="hidden" name="imageSizeBytes" defaultValue="" />
      {uploadError && <p role="alert" className="text-sm text-destructive">{t.workflow[uploadError]}</p>}
      <p className="text-xs text-muted-foreground">{t.workflow.pendingApproval}</p>
      <ActionFeedback state={state} />
      <Button type="submit" disabled={pending || uploading}>{uploading || pending ? t.common.loading : t.workflow.addListing}</Button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
