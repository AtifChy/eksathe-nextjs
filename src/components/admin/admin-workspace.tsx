"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  grantStaffAccessAction,
  markCommissionCollectedAction,
  moderateListingAction,
  moderateProviderCapabilityAction,
  recordRefundAction,
  resolveDisputeAction,
  revokeStaffAccessAction,
  updateSectorCommissionRateAction,
} from "@/app/actions/admin";
import { useLanguage } from "@/components/language-provider";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { StatusBadge } from "@/components/workflows/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminWorkspace as AdminWorkspaceData } from "@/lib/workspaces";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";
import { initialWorkflowState } from "@/lib/workflow-state";
import { AgricultureRequestsQueue } from "@/components/admin/agriculture-requests-queue";

export function AdminWorkspace({ data }: { data: AdminWorkspaceData }) {
  const { locale, t } = useLanguage();
  const formatMoney = (value: string) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));
  const operationsEnabled = data.access.operationSectors.length > 0;
  const agricultureOperationsEnabled = data.access.operationSectors.includes("agriculture-labor");
  const financeEnabled = data.access.financeSectors.length > 0;

  return (
    <WorkspaceNavigation label={locale === "bn" ? "প্রশাসন নেভিগেশন" : "Administration navigation"} items={[
      ...(operationsEnabled ? [{ id: "provider-approvals", label: t.workflow.adminApprovals }, { id: "listing-moderation", label: locale === "bn" ? "তালিকা" : "Listings" }, { id: "requests", label: t.workflow.adminRequests }, { id: "disputes", label: locale === "bn" ? "বিরোধ" : "Disputes" }] : []),
      ...(agricultureOperationsEnabled ? [{ id: "agriculture-requests", label: locale === "bn" ? "কৃষি অনুরোধ" : "Agriculture intake" }] : []),
      ...(financeEnabled ? [{ id: "payment-mismatches", label: locale === "bn" ? "পেমেন্ট যাচাই" : "Payments" }, { id: "commission", label: locale === "bn" ? "কমিশন" : "Commissions" }] : []),
      ...(data.access.isSuperAdmin ? [{ id: "commission-settings", label: locale === "bn" ? "কমিশন হার" : "Rates" }, { id: "staff-access", label: t.workflow.manageStaff }] : []),
    ]}>
      <div>
        <p className="text-sm text-primary">{locale === "bn" ? "প্ল্যাটফর্ম পরিচালনা" : "Platform operations"}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.nav.admin}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{locale === "bn" ? `আপনার বিভাগ: ${[...new Set([...data.access.operationSectors, ...data.access.financeSectors])].join(", ") || "সমগ্র প্ল্যাটফর্ম"}` : `Your sectors: ${[...new Set([...data.access.operationSectors, ...data.access.financeSectors])].join(", ") || "platform-wide"}`}</p>
        {agricultureOperationsEnabled && <Link href="/admin/agriculture/publishing" className="mt-3 inline-flex w-fit items-center rounded-lg border border-primary/30 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5">{locale === "bn" ? "কৃষি বাজারদর ও আপডেট প্রকাশ" : "Publish agriculture prices and updates"}</Link>}
      </div>

      {operationsEnabled && (
        <>
          <section id="provider-approvals" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{t.workflow.adminApprovals}</h2>
            {data.capabilities.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.capabilities.map((capability) => (
              <Card key={capability.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? capability.nameBn : capability.nameEn}</CardTitle><CardDescription>{capability.email} · {capability.phone} · {locale === "bn" ? capability.sectorTitleBn : capability.sectorTitleEn} · {capability.kind}</CardDescription></div><StatusBadge status="PENDING" /></CardHeader>
                <CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">{locale === "bn" ? capability.bioBn : capability.bioEn}</p><p className="text-sm">{t.workflow.district}: {capability.district}</p><div className="flex flex-wrap gap-2"><CapabilityDecisionForm id={capability.id} decision="APPROVED" /><CapabilityDecisionForm id={capability.id} decision="REJECTED" /></div></CardContent>
              </Card>
            ))}
          </section>

          <section id="listing-moderation" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{locale === "bn" ? "তালিকা পর্যালোচনা" : "Listing moderation"}</h2>
            {data.listings.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.listings.map((listing) => (
              <Card key={listing.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? listing.titleBn : listing.titleEn}</CardTitle><CardDescription>{listing.kind} · {listing.category} · {listing.district}</CardDescription></div><StatusBadge status="PENDING" /></CardHeader>
                <CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">{locale === "bn" ? listing.providerNameBn : listing.providerNameEn}</p><p className="text-sm">{formatMoney(listing.unitPrice)} / {listing.unit} · {listing.stock} {listing.unit}</p><div className="flex flex-wrap gap-2"><ListingDecisionForm id={listing.id} decision="APPROVED" /><ListingDecisionForm id={listing.id} decision="REJECTED" /></div></CardContent>
              </Card>
            ))}
          </section>

          <section id="requests" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{t.workflow.adminRequests}</h2>
            {data.requests.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.requests.map((request) => (
              <Card key={request.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{locale === "bn" ? request.titleBn : request.titleEn}</CardTitle>
                    <CardDescription>{request.buyerName} · {locale === "bn" ? request.providerNameBn : request.providerNameEn} · {request.sectorSlug}</CardDescription>
                  </div>
                  <StatusBadge status={request.status} />
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {(request.packageLabel || request.projectTitle) && <p className="text-sm font-medium">{request.projectTitle ?? request.packageLabel}{request.projectTitle && request.packageLabel ? ` · ${request.packageLabel}` : ""}</p>}
                  {request.details && <p className="text-sm text-muted-foreground">{request.details}</p>}
                  <p className="text-sm">{request.district} · {request.quantity} {request.unit}{request.requestedStart ? ` · ${locale === "bn" ? "শুরু" : "Starts"}: ${new Date(request.requestedStart).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD")}` : ""}{request.requestedEnd ? ` · ${locale === "bn" ? "শেষ" : "Ends"}: ${new Date(request.requestedEnd).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD")}` : ""}</p>
                  {request.quote && <p className="text-sm">{locale === "bn" ? "দরপ্রস্তাব" : "Quote"}: {formatMoney(request.quote.unitPrice)} / {request.unit} · {locale === "bn" ? "পরিবহন" : "Transport"}: {formatMoney(request.quote.transportFee)}</p>}
                  <Link href={`/dashboard/${request.sectorSlug}/providers/${request.providerId}`} className="w-fit text-sm font-medium text-primary hover:underline">{locale === "bn" ? "সেবাদাতার প্রোফাইল" : "View provider profile"}</Link>
                </CardContent>
              </Card>
            ))}
          </section>

          <section id="disputes" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{locale === "bn" ? "বিরোধ নিষ্পত্তি" : "Disputes"}</h2>
            {data.disputes.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.disputes.map((dispute) => (
              <Card key={dispute.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? dispute.titleBn : dispute.titleEn}</CardTitle><CardDescription>{dispute.buyerName} · {locale === "bn" ? dispute.providerNameBn : dispute.providerNameEn} · {dispute.sectorSlug}</CardDescription></div><StatusBadge status="DISPUTED" /></CardHeader>
                <CardContent className="flex flex-col gap-3"><p className="text-sm text-muted-foreground">{dispute.cancellationReason}</p><DisputeResolutionForm orderId={dispute.id} /></CardContent>
              </Card>
            ))}
          </section>
        </>
      )}

      {agricultureOperationsEnabled && <AgricultureRequestsQueue requests={data.agricultureRequests} staff={data.agricultureStaff} filters={data.agricultureFilters} />}

      {financeEnabled && (
        <>
          <section id="payment-mismatches" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{locale === "bn" ? "পেমেন্ট মিল যাচাই" : "Payment confirmations"}</h2>
            {data.paymentMismatches.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.paymentMismatches.map((payment) => (
              <Card key={payment.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? payment.titleBn : payment.titleEn}</CardTitle><CardDescription>{payment.buyerName} · {locale === "bn" ? payment.providerNameBn : payment.providerNameEn} · {payment.sectorSlug}</CardDescription></div><StatusBadge status="PENDING" /></CardHeader>
                <CardContent className="flex flex-col gap-3"><p className="text-sm">{formatMoney(payment.amount)}{payment.reference ? ` · ${payment.reference}` : ""}</p>{payment.hasReceipt && <a className="w-fit text-sm font-medium text-primary hover:underline" href={`/api/orders/${payment.orderId}/payments/${payment.id}/receipt`}>{t.workflow.viewReceipt}</a>}<p className="text-xs text-muted-foreground">{locale === "bn" ? `ক্রেতা নিশ্চিত: ${payment.buyerConfirmed ? "হ্যাঁ" : "না"} · সেবাদাতা নিশ্চিত: ${payment.providerConfirmed ? "হ্যাঁ" : "না"}` : `Customer confirmed: ${payment.buyerConfirmed ? "yes" : "no"} · Provider confirmed: ${payment.providerConfirmed ? "yes" : "no"}`}</p><RefundForm paymentId={payment.id} /></CardContent>
              </Card>
            ))}
          </section>

          <section id="commission" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{t.workflow.commissionsDue}</h2>
            {data.commissions.length === 0 ? <Empty text={t.workflow.noRecords} /> : data.commissions.map((commission) => (
              <Card key={commission.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? commission.titleBn : commission.titleEn}</CardTitle><CardDescription>{commission.buyerName} · {locale === "bn" ? commission.providerNameBn : commission.providerNameEn} · {commission.sectorSlug}</CardDescription></div><StatusBadge status="DUE" /></CardHeader>
                <CardContent><p className="mb-3 text-sm font-semibold">{formatMoney(commission.amount)}</p><CommissionReceiptForm commissionId={commission.id} /></CardContent>
              </Card>
            ))}
          </section>
        </>
      )}

      {data.access.isSuperAdmin && (
        <>
          <section id="commission-settings" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{locale === "bn" ? "বিভাগভিত্তিক কমিশন" : "Sector commission settings"}</h2>
            {data.sectors.map((sector) => <CommissionRateForm key={sector.slug} sector={sector} />)}
          </section>
          <section id="staff-access" className="scroll-mt-24 flex flex-col gap-4">
            <h2 className="text-xl font-bold">{t.workflow.manageStaff}</h2>
            <StaffGrantForm />
            {data.staffGrants.map((grant) => <StaffGrantRow key={grant.id} grant={grant} />)}
          </section>
        </>
      )}
    </WorkspaceNavigation>
  );
}

function CapabilityDecisionForm({ id, decision }: { id: number; decision: "APPROVED" | "REJECTED" }) {
  const [state, action, pending] = useActionState(moderateProviderCapabilityAction, initialWorkflowState);
  const { t } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value={decision} /><ActionFeedback state={state} /><Button type="submit" size="sm" disabled={pending} variant={decision === "APPROVED" ? "default" : "outline"}>{pending ? t.common.loading : decision === "APPROVED" ? t.workflow.approve : t.workflow.reject}</Button></form>;
}

function ListingDecisionForm({ id, decision }: { id: string; decision: "APPROVED" | "REJECTED" }) {
  const [state, action, pending] = useActionState(moderateListingAction, initialWorkflowState);
  const { t } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="id" value={id} /><input type="hidden" name="decision" value={decision} /><ActionFeedback state={state} /><Button type="submit" size="sm" disabled={pending} variant={decision === "APPROVED" ? "default" : "outline"}>{pending ? t.common.loading : decision === "APPROVED" ? t.workflow.approve : t.workflow.reject}</Button></form>;
}

function DisputeResolutionForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(resolveDisputeAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)_auto]"><input type="hidden" name="orderId" value={orderId} /><Field id={`dispute-outcome-${orderId}`} label={locale === "bn" ? "সিদ্ধান্ত" : "Resolution"}><select id={`dispute-outcome-${orderId}`} name="decision" className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="COMPLETE">{locale === "bn" ? "সম্পন্ন হিসেবে চিহ্নিত" : "Mark completed"}</option><option value="CANCEL">{locale === "bn" ? "বাতিল ও মজুত ফেরত" : "Cancel and release stock"}</option></select></Field><Field id={`dispute-note-${orderId}`} label={t.workflow.details}><Input id={`dispute-note-${orderId}`} name="note" maxLength={1000} /></Field><div className="flex flex-col gap-2 sm:justify-end"><ActionFeedback state={state} /><Button type="submit" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "সিদ্ধান্ত সংরক্ষণ" : "Record decision")}</Button></div></form>;
}

function CommissionReceiptForm({ commissionId }: { commissionId: string }) {
  const [state, action, pending] = useActionState(markCommissionCollectedAction, initialWorkflowState);
  const { t } = useLanguage();
  return <form action={action} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><input type="hidden" name="commissionId" value={commissionId} /><Field id={`commission-reference-${commissionId}`} label={t.workflow.reference}><Input id={`commission-reference-${commissionId}`} name="reference" maxLength={120} /></Field><div className="flex flex-col gap-2 sm:justify-end"><ActionFeedback state={state} /><Button type="submit" disabled={pending}>{pending ? t.common.loading : t.workflow.markCollected}</Button></div></form>;
}

function RefundForm({ paymentId }: { paymentId: string }) {
  const [state, action, pending] = useActionState(recordRefundAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <details className="rounded-lg border border-border/70 p-3"><summary className="cursor-pointer text-sm font-medium">{locale === "bn" ? "ফেরত নথিভুক্ত করুন" : "Record a refund"}</summary><form action={action} className="mt-3 grid gap-3 sm:grid-cols-3"><input type="hidden" name="paymentId" value={paymentId} /><Field id={`refund-amount-${paymentId}`} label={t.workflow.paymentAmount}><Input id={`refund-amount-${paymentId}`} name="amount" type="number" min="0.01" step="0.01" required /></Field><Field id={`refund-reference-${paymentId}`} label={t.workflow.reference}><Input id={`refund-reference-${paymentId}`} name="reference" maxLength={120} /></Field><div className="flex flex-col gap-2 sm:justify-end"><ActionFeedback state={state} /><Button type="submit" variant="outline" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "ফেরত সংরক্ষণ" : "Record refund")}</Button></div></form></details>;
}

function CommissionRateForm({ sector }: { sector: AdminWorkspaceData["sectors"][number] }) {
  const [state, action, pending] = useActionState(updateSectorCommissionRateAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="grid gap-3 rounded-xl border border-border/70 bg-card p-4 sm:grid-cols-[minmax(0,1fr)_180px_auto]"><input type="hidden" name="sectorSlug" value={sector.slug} /><div><p className="font-semibold">{locale === "bn" ? sector.titleBn : sector.titleEn}</p><p className="text-xs text-muted-foreground">{sector.slug}</p></div><Field id={`commission-rate-${sector.slug}`} label={locale === "bn" ? "কমিশন হার (%)" : "Commission rate (%)"}><Input id={`commission-rate-${sector.slug}`} name="rate" type="number" min="0" max="100" step="0.01" defaultValue={sector.commissionRate} required /></Field><div className="flex flex-col gap-2 sm:justify-end"><ActionFeedback state={state} /><Button type="submit" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "হালনাগাদ" : "Update")}</Button></div></form>;
}

function StaffGrantForm() {
  const [state, action, pending] = useActionState(grantStaffAccessAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="grid gap-3 rounded-xl border border-border/70 bg-card p-4 sm:grid-cols-3"><Field id="staff-email" label={t.workflow.staffEmail}><Input id="staff-email" name="email" type="email" required /></Field><Field id="staff-permission" label={t.workflow.staffPermission}><select id="staff-permission" name="permission" className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="OPERATIONS">{locale === "bn" ? "পরিচালনা" : "Operations"}</option><option value="FINANCE">{locale === "bn" ? "অর্থনীতি" : "Finance"}</option></select></Field><Field id="staff-scope" label={t.workflow.staffScope}><select id="staff-scope" name="scope" className="h-9 rounded-lg border border-input bg-background px-3 text-sm"><option value="global">{locale === "bn" ? "সমগ্র প্ল্যাটফর্ম" : "Platform-wide"}</option><option value="agriculture-labor">{locale === "bn" ? "কৃষি ও শ্রমিক" : "Agriculture & Labor"}</option><option value="construction">{locale === "bn" ? "নির্মাণ" : "Construction"}</option></select></Field><div className="flex flex-col gap-2 sm:col-span-3"><ActionFeedback state={state} /><Button type="submit" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "প্রবেশাধিকার দিন" : "Grant access")}</Button></div></form>;
}

function StaffGrantRow({ grant }: { grant: AdminWorkspaceData["staffGrants"][number] }) {
  const [state, action, pending] = useActionState(revokeStaffAccessAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-card px-4 py-3"><input type="hidden" name="id" value={grant.id} /><p className="text-sm"><strong>{grant.name}</strong> · {grant.email} · {grant.permission} · {grant.scopeKey}</p><div className="flex items-center gap-3"><ActionFeedback state={state} /><Button type="submit" size="sm" variant="outline" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "সরান" : "Revoke")}</Button></div></form>;
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</div>;
}
