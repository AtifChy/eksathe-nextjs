"use client";

import Link from "next/link";
import { useActionState } from "react";
import { archiveListingAction, updateListingStockAction } from "@/app/actions/marketplace";
import { ProviderApplicationForm } from "@/components/provider/provider-application-form";
import { ListingForm } from "@/components/provider/listing-form";
import { ListingEditForm } from "@/components/provider/listing-edit-form";
import { StorefrontForm } from "@/components/provider/storefront-form";
import { QuoteForm } from "@/components/provider/quote-form";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { OrderCard } from "@/components/workflows/order-card";
import { StatusBadge } from "@/components/workflows/status-badge";
import { MilestoneList } from "@/components/projects/milestone-list";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProviderWorkspace as ProviderWorkspaceData } from "@/lib/workspaces";
import { initialWorkflowState } from "@/lib/workflow-state";

export function ProviderWorkspace({ workspace, actorId }: { workspace: ProviderWorkspaceData; actorId: string }) {
  const { locale, t } = useLanguage();
  const capabilities = workspace.capabilities.filter((capability) => capability.status === "APPROVED");

  return (
    <WorkspaceNavigation label={locale === "bn" ? "সেবাদাতা নেভিগেশন" : "Provider navigation"} items={[
      ...(workspace.profile.status === "APPROVED" && capabilities.length > 0 ? [{ id: "listings", label: locale === "bn" ? "তালিকা" : "Listings" }] : []),
      ...(workspace.profile.status === "APPROVED" ? [{ id: "storefront", label: locale === "bn" ? "স্টোরফ্রন্ট" : "Storefront" }] : []),
      { id: "requests", label: locale === "bn" ? "অনুরোধ" : "Requests" },
      { id: "orders", label: locale === "bn" ? "অর্ডার" : "Orders" },
      ...(workspace.projectMilestones.length > 0 ? [{ id: "project-milestones", label: t.workflow.milestones }] : []),
      { id: "commissions", label: locale === "bn" ? "কমিশন" : "Commissions" },
      { id: "application", label: t.workflow.providerApplication },
    ]}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-primary">{locale === "bn" ? "ব্যবসা পরিচালনা" : "Business operations"}</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">{t.nav.provider}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{locale === "bn" ? workspace.profile.nameBn : workspace.profile.nameEn} · {workspace.profile.district}</p>
        </div>
        <StatusBadge status={workspace.profile.status} />
      </div>

      {workspace.profile.status === "PENDING" && (
        <div className="rounded-xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">{t.workflow.pendingApproval}</div>
      )}
      {workspace.profile.status === "SUSPENDED" && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{locale === "bn" ? "এই প্রোফাইল থেকে নতুন অনুরোধ নেওয়া বা তালিকা প্রকাশ করা স্থগিত আছে। প্রশাসনিক দলের সঙ্গে যোগাযোগ করুন।" : "This provider profile is suspended. It cannot publish listings or accept new requests; contact the administration team."}</div>
      )}

      {workspace.profile.status === "APPROVED" && capabilities.length > 0 && (
        <section id="listings" className="scroll-mt-24">
          <Card>
            <CardHeader>
              <CardTitle>{t.workflow.createListing}</CardTitle>
              <CardDescription>{locale === "bn" ? "তালিকা প্রকাশের আগে প্রশাসনিক পর্যালোচনা হবে।" : "New listings are reviewed by the operations team before publication."}</CardDescription>
            </CardHeader>
            <CardContent>
              <details>
              <summary className="mb-4 cursor-pointer text-sm font-semibold text-primary">{locale === "bn" ? "নতুন তালিকা যোগ করুন" : "Add a listing"}</summary>
                <ListingForm capabilities={capabilities} />
              </details>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {workspace.listings.length === 0 ? <p className="text-sm text-muted-foreground">{t.workflow.noRecords}</p> : workspace.listings.map((listing) => (
                  <ListingStockCard key={listing.id} listing={listing} locale={locale} />
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section id="requests" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{t.workflow.incomingRequests}</h2>
        {workspace.requests.length === 0 ? <EmptyState text={t.workflow.noRecords} /> : workspace.requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{locale === "bn" ? request.listing.titleBn : request.listing.titleEn}</CardTitle>
                <CardDescription>{request.buyerName} · {request.district} · {request.quantity} {request.listing.unit}</CardDescription>
              </div>
              <StatusBadge status={request.status} />
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{request.details || (locale === "bn" ? "কোনো অতিরিক্ত তথ্য নেই।" : "No additional details provided.")}</p>
              {(request.requestedStart || request.requestedEnd) && <p className="mt-2 text-sm">{t.workflow.startDate}: {request.requestedStart?.slice(0, 10)} – {request.requestedEnd?.slice(0, 10)}</p>}
              {request.status !== "ACCEPTED" && <QuoteForm request={request} />}
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="orders" className="scroll-mt-24 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold">{locale === "bn" ? "অর্ডার ও বুকিং" : "Orders and bookings"}</h2>
          <Link className={buttonVariants({ variant: "outline", size: "sm" })} href="/account">{locale === "bn" ? "গ্রাহক প্যানেল" : "Customer workspace"}</Link>
        </div>
        {workspace.orders.length === 0 ? <EmptyState text={t.workflow.noRecords} /> : workspace.orders.map((order) => <OrderCard key={order.id} order={order} actorId={actorId} perspective="provider" />)}
      </section>

      {workspace.projectMilestones.length > 0 && (
        <section id="project-milestones" className="scroll-mt-24 flex flex-col gap-4">
          <h2 className="text-xl font-bold">{t.workflow.milestones}</h2>
          {Array.from(new Set(workspace.projectMilestones.map((milestone) => milestone.projectId))).map((projectId) => {
            const milestones = workspace.projectMilestones.filter((milestone) => milestone.projectId === projectId);
            const first = milestones[0];
            return <Card key={projectId}><CardHeader><CardTitle className="text-lg">{first.projectTitle}</CardTitle><CardDescription>{first.district}</CardDescription></CardHeader><CardContent><MilestoneList milestones={milestones} provider /></CardContent></Card>;
          })}
        </section>
      )}

      <section id="commissions" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "কমিশন" : "Commission records"}</h2>
        {workspace.orders.filter((order) => order.commission).length === 0 ? <EmptyState text={t.workflow.noRecords} /> : workspace.orders.filter((order) => order.commission).map((order) => (
          <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card p-4 text-sm">
            <span>{locale === "bn" ? order.listing.titleBn : order.listing.titleEn} · {order.commission?.amount} BDT</span>
            <StatusBadge status={order.commission?.status ?? "DUE"} />
          </div>
        ))}
      </section>

      {workspace.profile.status === "APPROVED" && (
        <section id="storefront" className="scroll-mt-24">
          <Card>
            <CardHeader><CardTitle>{locale === "bn" ? "আপনার স্টোরফ্রন্ট" : "Your storefront"}</CardTitle><CardDescription>{locale === "bn" ? "গ্রাহকরা এই নাম, পরিচিতি ও ছবিগুলো পাবেন।" : "Customers see these details, your profile photo, and cover photo."}</CardDescription></CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-3">
                {capabilities.some((capability) => capability.sectorSlug === "agriculture-labor") && <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/agriculture/providers/${workspace.profile.id}`}>{locale === "bn" ? "সর্বজনীন কৃষি স্টোরফ্রন্ট দেখুন" : "Preview agriculture storefront"}</Link>}
                {capabilities.some((capability) => capability.sectorSlug === "construction") && <Link className={buttonVariants({ variant: "outline", size: "sm" })} href={`/dashboard/construction/providers/${workspace.profile.id}`}>{locale === "bn" ? "সর্বজনীন নির্মাণ প্রোফাইল দেখুন" : "Preview construction profile"}</Link>}
              </div>
              <StorefrontForm profile={workspace.profile} />
            </CardContent>
          </Card>
        </section>
      )}

      <Card id="application">
        <CardHeader><CardTitle>{t.workflow.providerApplication}</CardTitle><CardDescription>{locale === "bn" ? "আরও সেবা বিভাগে কাজ করতে অতিরিক্ত সক্ষমতার জন্য আবেদন করুন।" : "Apply for additional sector capabilities from the same business profile."}</CardDescription></CardHeader>
        <CardContent>
          <details>
            <summary className="mb-4 cursor-pointer text-sm font-semibold text-primary">{locale === "bn" ? "প্রোফাইল বা সক্ষমতা হালনাগাদ করুন" : "Update profile or request capabilities"}</summary>
            <ProviderApplicationForm initial={{ ...workspace.profile, upazila: workspace.profile.upazila ?? "", capabilities: workspace.capabilities.map((capability) => `${capability.sectorSlug}:${capability.kind}`) }} />
          </details>
        </CardContent>
      </Card>

      {workspace.notifications.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-bold">{locale === "bn" ? "বিজ্ঞপ্তি" : "Notifications"}</h2>
          {workspace.notifications.slice(0, 5).map((notification) => <div key={notification.id} className="rounded-lg border border-border/70 bg-card px-4 py-3 text-sm"><p className="font-medium">{locale === "bn" ? notification.titleBn : notification.titleEn}</p><p className="mt-1 text-muted-foreground">{locale === "bn" ? notification.messageBn : notification.messageEn}</p></div>)}
        </section>
      )}
    </WorkspaceNavigation>
  );
}

function ListingStockCard({ listing, locale }: { listing: ProviderWorkspaceData["listings"][number]; locale: "bn" | "en" }) {
  const [state, action, pending] = useActionState(updateListingStockAction, initialWorkflowState);
  const { t } = useLanguage();
  const tracksStock = listing.kind === "PRODUCE" || listing.kind === "CONSTRUCTION_MATERIAL";
  return (
    <div className="rounded-xl border border-border/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-semibold">{locale === "bn" ? listing.titleBn : listing.titleEn}</p><p className="mt-1 text-xs text-muted-foreground">{tracksStock ? `${listing.stock} ${listing.unit}` : (locale === "bn" ? "তারিখ অনুযায়ী বুকিং উপলভ্যতা যাচাই হবে" : "Availability is checked against booking dates")} · {listing.unitPrice} BDT/{listing.unit}</p></div>
        <StatusBadge status={listing.moderationStatus} />
      </div>
      {listing.archivedAt ? <p className="mt-3 text-sm text-muted-foreground">{locale === "bn" ? "এই তালিকা সংরক্ষণাগারে রাখা হয়েছে।" : "This listing is archived."}</p> : (
        <>
          {tracksStock && <form action={action} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="listingId" value={listing.id} />
            <div className="flex flex-col gap-2"><Label htmlFor={`stock-${listing.id}`}>{t.workflow.stock}</Label><Input id={`stock-${listing.id}`} name="stock" type="number" min="0" step="0.001" defaultValue={listing.stock} className="w-40" /></div>
            <Button size="sm" variant="outline" type="submit" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "পরিমাণ সংরক্ষণ" : "Save quantity")}</Button>
          </form>}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-primary">{locale === "bn" ? "তালিকা সম্পাদনা" : "Edit listing"}</summary>
            <div className="mt-3"><ListingEditForm listing={listing} locale={locale} /></div>
          </details>
          <ListingArchiveControl listingId={listing.id} locale={locale} />
        </>
      )}
      <ActionFeedback state={state} />
    </div>
  );
}

function ListingArchiveControl({ listingId, locale }: { listingId: string; locale: "bn" | "en" }) {
  const [state, action, pending] = useActionState(archiveListingAction, initialWorkflowState);
  const { t } = useLanguage();
  return <div className="mt-3 flex flex-wrap items-center gap-3"><form action={action}><input type="hidden" name="listingId" value={listingId} /><Button size="sm" variant="ghost" type="submit" disabled={pending}>{pending ? t.common.loading : (locale === "bn" ? "তালিকা আর্কাইভ করুন" : "Archive listing")}</Button></form><ActionFeedback state={state} /></div>;
}

function EmptyState({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</div>;
}
