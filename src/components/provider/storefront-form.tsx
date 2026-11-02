"use client";

import { type FormEvent, useActionState, useEffect, useRef, useState } from "react";
import { updateProviderStorefrontAction } from "@/app/actions/marketplace";
import { uploadPrivateFile } from "@/lib/client-upload";
import { useLanguage } from "@/components/language-provider";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialWorkflowState } from "@/lib/workflow-state";

export type StorefrontValues = {
  id: string;
  nameBn: string;
  nameEn: string;
  bioBn: string;
  bioEn: string;
  district: string;
  upazila: string | null;
  hasProfileImage: boolean;
  hasCoverImage: boolean;
};

export function StorefrontForm({ profile }: { profile: StorefrontValues }) {
  const [state, action, pending] = useActionState(updateProviderStorefrontAction, initialWorkflowState);
  const { locale } = useLanguage();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const profileFile = useRef<HTMLInputElement>(null);
  const coverFile = useRef<HTMLInputElement>(null);
  const uploaded = useRef<{ profile: File | null; cover: File | null }>({ profile: null, cover: null });

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      uploaded.current = { profile: null, cover: null };
    }
  }, [state.status]);

  async function prepareUpload(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const files = [
      { type: "profile" as const, input: profileFile.current, key: "profileImageKey", contentType: "profileImageContentType", size: "profileImageSizeBytes" },
      { type: "cover" as const, input: coverFile.current, key: "coverImageKey", contentType: "coverImageContentType", size: "coverImageSizeBytes" },
    ];
    const selected = files.filter((item) => item.input?.files?.[0] && uploaded.current[item.type] !== item.input.files[0]);
    if (!selected.length) return;
    event.preventDefault();
    setUploading(true);
    setUploadError(false);
    try {
      for (const item of selected) {
        const file = item.input?.files?.[0];
        if (!file) continue;
        const result = await uploadPrivateFile(file, { purpose: "provider-storefront-image", imageType: item.type });
        for (const [name, value] of [[item.key, result.key], [item.contentType, result.contentType], [item.size, result.sizeBytes]] as const) {
          const field = form.elements.namedItem(name);
          if (field instanceof HTMLInputElement) field.value = value;
        }
        uploaded.current[item.type] = file;
      }
      form.requestSubmit();
    } catch {
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  }

  const bn = locale === "bn";
  return (
    <form ref={formRef} action={action} onSubmit={prepareUpload} className="flex flex-col gap-4 rounded-xl border border-border/70 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="storefront-name-bn" label={bn ? "দোকানের নাম (বাংলা)" : "Store name (Bangla)"}><Input id="storefront-name-bn" name="nameBn" defaultValue={profile.nameBn} required maxLength={100} /></Field>
        <Field id="storefront-name-en" label={bn ? "দোকানের নাম (ইংরেজি)" : "Store name (English)"}><Input id="storefront-name-en" name="nameEn" defaultValue={profile.nameEn} required maxLength={100} /></Field>
        <Field id="storefront-district" label={bn ? "জেলা" : "District"}><Input id="storefront-district" name="district" defaultValue={profile.district} required maxLength={80} /></Field>
        <Field id="storefront-upazila" label={bn ? "উপজেলা" : "Upazila"}><Input id="storefront-upazila" name="upazila" defaultValue={profile.upazila ?? ""} maxLength={80} /></Field>
      </div>
      <Field id="storefront-bio-bn" label={bn ? "পরিচিতি (বাংলা)" : "About the store (Bangla)"}><textarea id="storefront-bio-bn" name="bioBn" rows={3} maxLength={1200} defaultValue={profile.bioBn} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></Field>
      <Field id="storefront-bio-en" label={bn ? "পরিচিতি (ইংরেজি)" : "About the store (English)"}><textarea id="storefront-bio-en" name="bioEn" rows={3} maxLength={1200} defaultValue={profile.bioEn} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="storefront-profile-image" label={bn ? "প্রোফাইল ছবি" : "Profile photo"}><Input ref={profileFile} id="storefront-profile-image" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || pending} /></Field>
        <Field id="storefront-cover-image" label={bn ? "কভার ছবি" : "Cover photo"}><Input ref={coverFile} id="storefront-cover-image" type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading || pending} /></Field>
      </div>
      <p className="text-xs text-muted-foreground">{bn ? "JPG, PNG বা WebP, সর্বোচ্চ ৫ এমবি। ফাঁকা রাখলে বর্তমান ছবি থাকবে।" : "JPG, PNG or WebP, up to 5 MB. Leave blank to keep the current photo."} · {profile.hasProfileImage ? (bn ? "প্রোফাইল ছবি আছে" : "Profile photo set") : (bn ? "প্রোফাইল ছবি নেই" : "No profile photo")}</p>
      {(["profileImageKey", "profileImageContentType", "profileImageSizeBytes", "coverImageKey", "coverImageContentType", "coverImageSizeBytes"] as const).map((name) => <input key={name} type="hidden" name={name} defaultValue="" />)}
      {uploadError && <p role="alert" className="text-sm text-destructive">{bn ? "ছবি আপলোড করা যায়নি। আবার চেষ্টা করুন।" : "The image could not be uploaded. Please try again."}</p>}
      <ActionFeedback state={state} />
      <Button type="submit" disabled={pending || uploading}>{uploading || pending ? (bn ? "অপেক্ষা করুন…" : "Saving…") : (bn ? "স্টোরফ্রন্ট সংরক্ষণ" : "Save storefront")}</Button>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
