"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { acceptQuoteAction } from "@/app/actions/marketplace";
import { useLanguage } from "@/components/language-provider";
import { AddMilestoneForm, ProjectDocumentUploadForm, ProjectExpenseForm } from "@/components/projects/project-forms";
import { MilestoneList } from "@/components/projects/milestone-list";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { StatusBadge } from "@/components/workflows/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicListing } from "@/lib/listings";
import type { ProjectWorkspace as ProjectWorkspaceData } from "@/lib/workspaces";
import { initialWorkflowState } from "@/lib/workflow-state";
import { useActionState } from "react";
import { cn } from "cn";

export function ProjectDetail({ project, listings, listingsUnavailable }: { project: ProjectWorkspaceData | null; listings: PublicListing[]; listingsUnavailable: boolean }) {
  const { locale, t } = useLanguage();
  if (!project) return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">{t.workflow.permissionDenied}</p></div>;
  const formatMoney = (value: string | number) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));
  const requestGroups = new Map<string, typeof project.requests>();
  for (const request of project.requests) {
    const label = request.packageLabel || (locale === "bn" ? "অন্যান্য অনুরোধ" : "Other requests");
    requestGroups.set(label, [...(requestGroups.get(label) ?? []), request]);
  }
  const defaultPackageLabel = locale === "bn" ? "সাধারণ কাজ" : "General works";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6">
      <Link href="/account#projects" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{locale === "bn" ? "আমার প্রকল্প" : "My projects"}</Link>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-3xl">{project.title}</CardTitle><CardDescription>{project.projectType} · {project.district}{project.approximateArea ? ` · ${project.approximateArea}` : ""}</CardDescription></div><StatusBadge status={project.status} /></CardHeader>
        <CardContent className="flex flex-col gap-4"><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{project.description}</p><div className="grid gap-3 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-3"><p>{t.workflow.budget}: <strong>{project.budget ? formatMoney(project.budget) : (locale === "bn" ? "উল্লেখ নেই" : "Not specified")}</strong></p><p>{t.workflow.startDate}: <strong>{project.startsAt?.slice(0, 10) ?? "—"}</strong></p><p>{t.workflow.endDate}: <strong>{project.targetEndsAt?.slice(0, 10) ?? "—"}</strong></p></div></CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div><h2 className="text-xl font-bold">{locale === "bn" ? "দরপ্রস্তাব ও অর্ডার" : "Quotes and orders"}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "একই প্যাকেজের নাম দিয়ে একাধিক সেবাদাতাকে অনুরোধ পাঠালে তাদের দর পাশাপাশি তুলনা করতে পারবেন।" : "Use the same package name when inviting several providers to compare their quotes side by side."}</p></div>
        {project.requests.length === 0 ? <Empty text={t.workflow.noRecords} /> : Array.from(requestGroups.entries()).map(([packageLabel, requests]) => {
          const accepted = requests.some((request) => Boolean(request.order));
          return <section key={packageLabel} className="flex flex-col gap-3 rounded-2xl bg-muted/30 p-4"><h3 className="text-lg font-semibold">{packageLabel}</h3><div className="grid gap-3 xl:grid-cols-2">{requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? request.listing.titleBn : request.listing.titleEn}</CardTitle><CardDescription><Link href={`/dashboard/construction/providers/${request.providerId}`} className="hover:underline">{locale === "bn" ? request.providerNameBn : request.providerNameEn}</Link> · {request.listing.kind}</CardDescription></div><StatusBadge status={request.status} /></CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">{request.details || (locale === "bn" ? "অতিরিক্ত তথ্য নেই।" : "No additional scope details." )}</p>
                {(request.requestedStart || request.requestedEnd) && <p className="text-sm">{t.workflow.startDate}: {request.requestedStart?.slice(0, 10)} – {request.requestedEnd?.slice(0, 10)}</p>}
                {request.quote ? <div className="grid gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 sm:grid-cols-2"><div><p className="text-xs text-muted-foreground">{t.workflow.quantity}</p><p className="mt-1 font-semibold">{request.quote.quantity} {request.listing.unit}</p></div><div><p className="text-xs text-muted-foreground">{t.workflow.quotePrice}</p><p className="mt-1 font-semibold">{formatMoney(request.quote.unitPrice)} / {request.listing.unit}</p></div><div><p className="text-xs text-muted-foreground">{t.workflow.transportFee}</p><p className="mt-1 font-semibold">{formatMoney(request.quote.transportFee)}</p></div><div><p className="text-xs text-muted-foreground">{locale === "bn" ? "মোট" : "Total"}</p><p className="mt-1 font-semibold">{formatMoney(Number(request.quote.quantity) * Number(request.quote.unitPrice) + Number(request.quote.transportFee))}</p></div><div className="sm:col-span-2"><p className="whitespace-pre-line text-sm text-muted-foreground">{request.quote.note}</p>{request.quote.expiresAt && <p className="mt-1 text-xs text-muted-foreground">{locale === "bn" ? "মেয়াদ শেষ" : "Expires"}: {request.quote.expiresAt.slice(0, 10)}</p>}</div>{project.isOwner && request.status === "QUOTED" && !accepted && <div className="sm:col-span-2"><AcceptQuoteForm requestId={request.id} /></div>}</div> : <p className="text-sm text-muted-foreground">{locale === "bn" ? "সেবাদাতার দরপ্রস্তাবের অপেক্ষায়।" : "Waiting for a provider quote."}</p>}
              </CardContent>
            </Card>
          ))}</div></section>;
        })}
      </section>

      {project.isOwner && (
        <section className="flex flex-col gap-4">
          <div><h2 className="text-xl font-bold">{locale === "bn" ? "সেবাদাতাদের আমন্ত্রণ জানান" : "Invite providers to quote"}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "একই প্যাকেজের দর তুলনা করতে আমন্ত্রণ ফর্মে সবার জন্য একই নাম ব্যবহার করুন।" : "Use the same package name on each invite to compare providers for the same scope."}</p></div>
          {listingsUnavailable ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{t.workflow.dataUnavailable}</p> : listings.length === 0 ? <Empty text={t.workflow.noRecords} /> : <div className="grid gap-3 sm:grid-cols-2">{listings.map((listing) => <div key={listing.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4"><div><p className="font-semibold">{locale === "bn" ? listing.titleBn : listing.titleEn}</p><p className="mt-1 text-xs text-muted-foreground">{locale === "bn" ? listing.providerNameBn : listing.providerNameEn} · {listing.district}</p><p className="mt-1 text-sm text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</p></div><Link className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1")} href={`/dashboard/construction/listings/${listing.id}?${new URLSearchParams({ projectId: project.id, packageLabel: defaultPackageLabel }).toString()}`}>{locale === "bn" ? "আমন্ত্রণ" : "Invite"}<ArrowRightIcon aria-hidden="true" className="size-4" /></Link></div>)}</div>}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div><h2 className="text-xl font-bold">{t.workflow.milestones}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "সেবাদাতা অগ্রগতি পাঠালে আপনি ধাপ অনুমোদন করতে পারবেন।" : "Providers submit progress for your approval."}</p></div>
        {project.milestones.length > 0 ? <MilestoneList milestones={project.milestones} owner={project.isOwner} /> : <Empty text={t.workflow.noRecords} />}
        {project.isOwner && <AddMilestoneForm projectId={project.id} />}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "নথিভুক্ত অর্ডার" : "Engaged providers and materials"}</h2>
        {project.orders.length === 0 ? <Empty text={t.workflow.noRecords} /> : project.orders.map((order) => <Card key={order.id}><CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? order.titleBn : order.titleEn}</CardTitle><CardDescription>{locale === "bn" ? order.providerNameBn : order.providerNameEn} · {formatMoney(order.subtotal)}{Number(order.transportFee) > 0 ? ` + ${formatMoney(order.transportFee)} ${t.workflow.transportFee}` : ""}</CardDescription></div><StatusBadge status={order.status} /></CardHeader>{order.payments.length > 0 && <CardContent className="flex flex-col gap-2"><h3 className="text-sm font-semibold">{t.workflow.projectPaymentHistory}</h3>{order.payments.map((payment) => <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2 text-sm"><div><p>{formatMoney(payment.amount)} · {paymentMethodText(payment.method, locale)}{payment.reference ? ` · ${payment.reference}` : ""}</p><p className="text-xs text-muted-foreground">{payment.confirmed ? (locale === "bn" ? "উভয় পক্ষ নিশ্চিত করেছে" : "Confirmed by both parties") : (locale === "bn" ? "নিশ্চিতকরণ বাকি" : "Awaiting confirmation")}{payment.refundAmount ? ` · ${locale === "bn" ? "ফেরত" : "Refunded"}: ${formatMoney(payment.refundAmount)}` : ""}</p></div>{payment.hasReceipt && <a className="text-xs font-medium text-primary hover:underline" href={`/api/orders/${order.id}/payments/${payment.id}/receipt`}>{t.workflow.viewReceipt}</a>}</div>)}</CardContent>}</Card>)}
      </section>

      {project.isOwner && <section className="flex flex-col gap-4"><div><h2 className="text-xl font-bold">{t.workflow.expenses}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "এই তালিকা শুধু প্রকল্পের মালিক দেখতে পারবেন।" : "These records are visible only to the project owner."}</p></div><div className="rounded-xl bg-muted/50 p-4 text-sm"><p>{locale === "bn" ? "নথিভুক্ত মোট খরচ" : "Recorded project expenses"}: <strong>{formatMoney(project.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0))}</strong></p></div>{project.expenses.length === 0 ? <Empty text={t.workflow.noRecords} /> : project.expenses.map((expense) => <div key={expense.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm"><span>{expense.description} · {expense.occurredAt?.slice(0, 10)}</span><strong>{formatMoney(expense.amount)}</strong></div>)}<ProjectExpenseForm projectId={project.id} /></section>}

      <section className="flex flex-col gap-3"><div><h2 className="text-xl font-bold">{t.workflow.projectDocuments}</h2><p className="mt-1 text-sm text-muted-foreground">{t.workflow.projectDocumentsHelp}</p></div>{project.documents.length === 0 ? <Empty text={locale === "bn" ? "এখনো কোনো প্রকল্প নথি যোগ হয়নি।" : "No project files have been added yet."} /> : project.documents.map((document) => <a key={document.id} href={`/api/projects/${project.id}/documents/${document.id}`} className="rounded-lg border border-border/70 bg-card px-4 py-3 text-sm font-medium text-primary hover:underline">{document.filename}</a>)}{project.isOwner && <ProjectDocumentUploadForm projectId={project.id} />}</section>
    </div>
  );
}

function AcceptQuoteForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(acceptQuoteAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="requestId" value={requestId} /><ActionFeedback state={state} /><p className="text-xs text-muted-foreground">{locale === "bn" ? "প্রকল্পের অনুরোধে একটি দরপ্রস্তাব গ্রহণ করা যাবে।" : "Only one quote can be accepted for this work package."}</p><Button type="submit" size="sm" disabled={pending}>{pending ? t.common.loading : t.workflow.acceptQuote}</Button></form>;
}

function paymentMethodText(method: string, locale: "bn" | "en") {
  if (locale === "bn") return ({ CASH: "নগদ", BANK_TRANSFER: "ব্যাংক ট্রান্সফার", MOBILE_WALLET: "মোবাইল ওয়ালেট", OTHER: "অন্যান্য" } as Record<string, string>)[method] ?? method;
  return ({ CASH: "Cash", BANK_TRANSFER: "Bank transfer", MOBILE_WALLET: "Mobile wallet", OTHER: "Other" } as Record<string, string>)[method] ?? method;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</div>;
}
