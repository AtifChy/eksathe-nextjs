"use client";

import { useActionState } from "react";
import { createMarketplaceRequestAction } from "@/app/actions/marketplace";
import { useLanguage } from "@/components/language-provider";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PublicListing } from "@/lib/listings";
import { initialWorkflowState } from "@/lib/workflow-state";

export function ListingRequestForm({ listing, projectId, packageLabel }: { listing: PublicListing; projectId?: string; packageLabel?: string }) {
  const [state, action, pending] = useActionState(createMarketplaceRequestAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  const isScheduled = listing.kind === "WORKER" || listing.kind === "MACHINERY" || listing.kind === "CONSTRUCTION_SERVICE";
  const returnTo = `/dashboard/${listing.sectorSlug}/listings/${listing.id}${projectId ? `?${new URLSearchParams({ projectId, ...(packageLabel ? { packageLabel } : {}) }).toString()}` : ""}`;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="listingId" value={listing.id} />
      <input type="hidden" name="returnTo" value={returnTo} />
      {projectId && <input type="hidden" name="projectId" value={projectId} />}
      {projectId && <div className="flex flex-col gap-2"><Label htmlFor="request-package-label">{t.workflow.workPackage}</Label><Input id="request-package-label" name="packageLabel" maxLength={80} defaultValue={packageLabel ?? (locale === "bn" ? "সাধারণ কাজ" : "General works")} required /></div>}
      {isScheduled ? (
        <input type="hidden" name="quantity" value="1" />
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="request-quantity">{t.workflow.quantity} ({listing.unit})</Label>
          <Input id="request-quantity" name="quantity" type="number" min="0.001" step="0.001" max={listing.stock} defaultValue="1" required />
          <p className="text-xs text-muted-foreground">{locale === "bn" ? `উপলভ্য: ${listing.stock} ${listing.unit}` : `Available: ${listing.stock} ${listing.unit}`}</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="request-district">{t.workflow.district}</Label>
          <Input id="request-district" name="district" maxLength={80} defaultValue={listing.district} required />
        </div>
        {isScheduled && (
          <>
            <div className="flex flex-col gap-2">
              <Label htmlFor="request-start">{t.workflow.startDate}</Label>
              <Input id="request-start" name="requestedStart" type="date" min={new Date().toISOString().slice(0, 10)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="request-end">{t.workflow.endDate}</Label>
              <Input id="request-end" name="requestedEnd" type="date" min={new Date().toISOString().slice(0, 10)} required />
            </div>
          </>
        )}
      </div>
      {isScheduled && <p className="-mt-2 text-xs text-muted-foreground">{locale === "bn" ? "দৈনিক ভাড়ার পরিমাণ তারিখের ব্যবধান অনুযায়ী হিসাব হবে।" : "Daily rates are calculated for the selected date range."}</p>}
      <div className="flex flex-col gap-2">
        <Label htmlFor="request-details">{t.workflow.details}</Label>
        <textarea id="request-details" name="details" maxLength={2000} rows={4} className="min-h-24 resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50" placeholder={locale === "bn" ? "প্রয়োজনীয় শর্ত, সংগ্রহ বা পরিবহনের তথ্য লিখুন" : "Add requirements, collection, or transport details"} />
      </div>
      <ActionFeedback state={state} />
      <Button type="submit" disabled={pending}>{pending ? t.common.loading : t.workflow.requestService}</Button>
    </form>
  );
}
