"use client";

import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { acceptQuoteAction } from "@/app/actions/marketplace";
import { useLanguage } from "@/components/language-provider";
import { AddMilestoneForm, ProjectDocumentUploadForm } from "@/components/projects/project-forms";
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

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6">
      <Link href="/account#projects" className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeftIcon aria-hidden="true" className="size-4" />{locale === "bn" ? "আমার প্রকল্প" : "My projects"}</Link>
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-3xl">{project.title}</CardTitle><CardDescription>{project.projectType} · {project.district}{project.approximateArea ? ` · ${project.approximateArea}` : ""}</CardDescription></div><StatusBadge status={project.status} /></CardHeader>
        <CardContent className="flex flex-col gap-4"><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{project.description}</p><div className="grid gap-3 rounded-xl bg-muted/50 p-4 text-sm sm:grid-cols-3"><p>{t.workflow.budget}: <strong>{project.budget ? formatMoney(project.budget) : (locale === "bn" ? "উল্লেখ নেই" : "Not specified")}</strong></p><p>{t.workflow.startDate}: <strong>{project.startsAt?.slice(0, 10) ?? "—"}</strong></p><p>{t.workflow.endDate}: <strong>{project.targetEndsAt?.slice(0, 10) ?? "—"}</strong></p></div></CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div><h2 className="text-xl font-bold">{locale === "bn" ? "দরপ্রস্তাব ও অর্ডার" : "Quotes and orders"}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "প্রতিটি কাজের প্যাকেজের জন্য আলাদা দরপ্রস্তাব তুলনা করুন।" : "Compare providers for each separate work package."}</p></div>
        {project.requests.length === 0 ? <Empty text={t.workflow.noRecords} /> : project.requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? request.listing.titleBn : request.listing.titleEn}</CardTitle><CardDescription>{locale === "bn" ? request.providerNameBn : request.providerNameEn} · {request.listing.kind}</CardDescription></div><StatusBadge status={request.status} /></CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">{request.details || (locale === "bn" ? "অতিরিক্ত তথ্য নেই।" : "No additional scope details." )}</p>
              {(request.requestedStart || request.requestedEnd) && <p className="text-sm">{t.workflow.startDate}: {request.requestedStart?.slice(0, 10)} – {request.requestedEnd?.slice(0, 10)}</p>}
              {request.quote ? <div className="grid gap-3 rounded-xl border border-border/70 bg-muted/30 p-4 sm:grid-cols-4"><div><p className="text-xs text-muted-foreground">{t.workflow.quantity}</p><p className="mt-1 font-semibold">{request.quote.quantity} {request.listing.unit}</p></div><div><p className="text-xs text-muted-foreground">{t.workflow.quotePrice}</p><p className="mt-1 font-semibold">{formatMoney(request.quote.unitPrice)} / {request.listing.unit}</p></div><div><p className="text-xs text-muted-foreground">{t.workflow.transportFee}</p><p className="mt-1 font-semibold">{formatMoney(request.quote.transportFee)}</p></div><div><p className="text-xs text-muted-foreground">{locale === "bn" ? "মোট" : "Total"}</p><p className="mt-1 font-semibold">{formatMoney(Number(request.quote.quantity) * Number(request.quote.unitPrice) + Number(request.quote.transportFee))}</p></div><div className="sm:col-span-4"><p className="whitespace-pre-line text-sm text-muted-foreground">{request.quote.note}</p>{request.quote.expiresAt && <p className="mt-1 text-xs text-muted-foreground">{locale === "bn" ? "মেয়াদ শেষ" : "Expires"}: {request.quote.expiresAt.slice(0, 10)}</p>}</div>{project.isOwner && request.status === "QUOTED" && <div className="sm:col-span-4"><AcceptQuoteForm requestId={request.id} /></div>}</div> : <p className="text-sm text-muted-foreground">{locale === "bn" ? "সেবাদাতার দরপ্রস্তাবের অপেক্ষায়।" : "Waiting for a provider quote."}</p>}
            </CardContent>
          </Card>
        ))}
      </section>

      {project.isOwner && (
        <section className="flex flex-col gap-4">
          <div><h2 className="text-xl font-bold">{locale === "bn" ? "সেবাদাতাদের আমন্ত্রণ জানান" : "Invite providers to quote"}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "প্রতিটি প্যাকেজের জন্য উপযুক্ত তালিকা খুলে প্রকল্পের সঙ্গে অনুরোধ পাঠান।" : "Open a suitable listing to send a quote request linked to this project."}</p></div>
          {listingsUnavailable ? <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{t.workflow.dataUnavailable}</p> : listings.length === 0 ? <Empty text={t.workflow.noRecords} /> : <div className="grid gap-3 sm:grid-cols-2">{listings.map((listing) => <div key={listing.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4"><div><p className="font-semibold">{locale === "bn" ? listing.titleBn : listing.titleEn}</p><p className="mt-1 text-xs text-muted-foreground">{locale === "bn" ? listing.providerNameBn : listing.providerNameEn} · {listing.district}</p><p className="mt-1 text-sm text-primary">{formatMoney(listing.unitPrice)} / {listing.unit}</p></div><Link className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0 gap-1")} href={`/dashboard/construction/listings/${listing.id}?projectId=${encodeURIComponent(project.id)}`}>{locale === "bn" ? "আমন্ত্রণ" : "Invite"}<ArrowRightIcon aria-hidden="true" className="size-4" /></Link></div>)}</div>}
        </section>
      )}

      <section className="flex flex-col gap-4">
        <div><h2 className="text-xl font-bold">{t.workflow.milestones}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "সেবাদাতা অগ্রগতি পাঠালে আপনি ধাপ অনুমোদন করতে পারবেন।" : "Providers submit progress for your approval."}</p></div>
        {project.milestones.length > 0 ? <MilestoneList milestones={project.milestones} owner={project.isOwner} /> : <Empty text={t.workflow.noRecords} />}
        {project.isOwner && <AddMilestoneForm projectId={project.id} />}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "নথিভুক্ত অর্ডার" : "Engaged providers and materials"}</h2>
        {project.orders.length === 0 ? <Empty text={t.workflow.noRecords} /> : project.orders.map((order) => <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4"><div><p className="font-semibold">{locale === "bn" ? order.titleBn : order.titleEn}</p><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? order.providerNameBn : order.providerNameEn}</p></div><StatusBadge status={order.status} /></div>)}
      </section>

      <section className="flex flex-col gap-3"><div><h2 className="text-xl font-bold">{t.workflow.projectDocuments}</h2><p className="mt-1 text-sm text-muted-foreground">{t.workflow.projectDocumentsHelp}</p></div>{project.documents.length === 0 ? <Empty text={locale === "bn" ? "এখনো কোনো প্রকল্প নথি যোগ হয়নি।" : "No project files have been added yet."} /> : project.documents.map((document) => <a key={document.id} href={`/api/projects/${project.id}/documents/${document.id}`} className="rounded-lg border border-border/70 bg-card px-4 py-3 text-sm font-medium text-primary hover:underline">{document.filename}</a>)}{project.isOwner && <ProjectDocumentUploadForm projectId={project.id} />}</section>
    </div>
  );
}

function AcceptQuoteForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(acceptQuoteAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="requestId" value={requestId} /><ActionFeedback state={state} /><p className="text-xs text-muted-foreground">{locale === "bn" ? "প্রকল্পের অনুরোধে একটি দরপ্রস্তাব গ্রহণ করা যাবে।" : "Only one quote can be accepted for this work package."}</p><Button type="submit" size="sm" disabled={pending}>{pending ? t.common.loading : t.workflow.acceptQuote}</Button></form>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</div>;
}
