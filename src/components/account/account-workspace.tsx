"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BellIcon, ClipboardListIcon, HardHatIcon, MailIcon, PhoneIcon, ShoppingBagIcon, UserRoundIcon } from "lucide-react";
import { acceptQuoteAction, cancelMarketplaceRequestAction } from "@/app/actions/marketplace";
import { markNotificationReadAction, updateProfileAction } from "@/app/actions/account";
import { AddMilestoneForm } from "@/components/projects/project-forms";
import { MilestoneList } from "@/components/projects/milestone-list";
import { WorkspaceNavigation } from "@/components/workspaces/workspace-navigation";
import { OrderCard } from "@/components/workflows/order-card";
import { StatusBadge } from "@/components/workflows/status-badge";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { useLanguage } from "@/components/language-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerWorkspace } from "@/lib/workspaces";
import { initialWorkflowState } from "@/lib/workflow-state";

export function AccountWorkspace({ workspace, user }: {
  workspace: CustomerWorkspace;
  user: { id: string; name: string; email: string; phone: string };
}) {
  const { locale, t } = useLanguage();
  const formatMoney = (value: string | number) => new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(value));

  return (
    <WorkspaceNavigation label={locale === "bn" ? "অ্যাকাউন্ট নেভিগেশন" : "Account navigation"} items={[
      { id: "profile", label: t.dashboard.profile, icon: UserRoundIcon },
      { id: "requests", label: locale === "bn" ? "অনুরোধ" : "Requests", icon: ClipboardListIcon },
      { id: "agriculture-requests", label: locale === "bn" ? "কৃষি সেবা অনুরোধ" : "Agriculture service requests", icon: ClipboardListIcon },
      { id: "orders", label: locale === "bn" ? "অর্ডার" : "Orders", icon: ShoppingBagIcon },
      { id: "projects", label: t.workflow.projectTitle, icon: HardHatIcon },
      { id: "notifications", label: t.dashboard.notifications, icon: BellIcon },
    ]}>
      <div>
        <p className="text-sm text-primary">{locale === "bn" ? "আপনার একাউন্ট" : "Your account"}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{locale === "bn" ? `স্বাগতম, ${user.name}` : `Welcome, ${user.name}`}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
      </div>

      <section id="profile" className="scroll-mt-24">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><UserRoundIcon aria-hidden="true" className="size-5 text-primary" />{t.dashboard.profile}</CardTitle><CardDescription>{locale === "bn" ? "এই তথ্য আপনার অনুরোধ ও বুকিংয়ে ব্যবহৃত হবে।" : "These details are used for requests and bookings."}</CardDescription></CardHeader>
          <CardContent>
            <ProfileForm user={user} />
          </CardContent>
        </Card>
      </section>

      <section id="agriculture-requests" className="scroll-mt-24 flex flex-col gap-4">
        <div><h2 className="text-xl font-bold">{locale === "bn" ? "কৃষি সেবা অনুরোধ" : "Agriculture service requests"}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "সেবার অবস্থা, আপনার জমা দেওয়া তথ্য ও পরিচালনা দলের আপডেট দেখুন।" : "Track request status, submitted details, and updates from the operations team."}</p></div>
        {workspace.agricultureRequests.length === 0 ? <Empty text={t.workflow.noRecords} /> : workspace.agricultureRequests.map((request) => <Card key={request.id}><CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle className="text-lg">{locale === "bn" ? request.service.titleBn : request.service.titleEn}</CardTitle><CardDescription>{request.referenceCode ?? `AG-${request.id}`} · {request.district} · {request.createdAt ? new Date(request.createdAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD") : ""}</CardDescription></div><StatusBadge status={request.status} /></CardHeader><CardContent className="flex flex-col gap-3"><p className="line-clamp-2 text-sm text-muted-foreground">{request.details}</p><div className="flex flex-wrap gap-3"><Link href={`/account/agriculture-requests/${request.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>{locale === "bn" ? "অনুরোধ দেখুন" : "View request"}</Link>{request.updates[0] && <span className="self-center text-xs text-muted-foreground">{locale === "bn" ? request.updates[0].messageBn ?? request.updates[0].messageEn : request.updates[0].messageEn ?? request.updates[0].messageBn}</span>}</div></CardContent></Card>)}
      </section>

      <section id="requests" className="scroll-mt-24 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-xl font-bold">{locale === "bn" ? "অনুরোধ ও দরপ্রস্তাব" : "Requests and quotes"}</h2>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm" })}>{t.nav.browse}</Link>
        </div>
        {workspace.requests.length === 0 ? <Empty text={t.workflow.noRecords} /> : workspace.requests.map((request) => (
          <Card key={request.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
              <div><CardTitle className="text-lg">{locale === "bn" ? request.listing.titleBn : request.listing.titleEn}</CardTitle><CardDescription>{locale === "bn" ? request.provider.nameBn : request.provider.nameEn} · {request.district} · {request.quantity} {request.listing.unit}</CardDescription></div>
              <StatusBadge status={request.status} />
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{request.details || (locale === "bn" ? "অতিরিক্ত তথ্য নেই।" : "No additional details provided.")}</p>
              {request.requestedStart && request.requestedEnd && <p className="text-sm">{t.workflow.startDate}: {request.requestedStart.slice(0, 10)} – {request.requestedEnd.slice(0, 10)}</p>}
              {request.quote && (
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">{locale === "bn" ? "সেবাদাতার দরপ্রস্তাব" : "Provider quote"}</h3><StatusBadge status={request.quote.status} /></div>
                  <p className="mt-2 text-sm">{t.workflow.quantity}: {request.quote.quantity} {request.listing.unit} × {formatMoney(request.quote.unitPrice)}</p>
                  {Number(request.quote.transportFee) > 0 && <p className="mt-1 text-sm">{t.workflow.transportFee}: {formatMoney(request.quote.transportFee)}</p>}
                  <p className="mt-1 text-sm">{locale === "bn" ? "মোট প্রস্তাব" : "Quoted total"}: <strong>{formatMoney(Number(request.quote.quantity) * Number(request.quote.unitPrice) + Number(request.quote.transportFee))}</strong></p>
                  {request.quote.note && <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{request.quote.note}</p>}
                  {request.quote.expiresAt && <p className="mt-2 text-xs text-muted-foreground">{locale === "bn" ? "মেয়াদ শেষ" : "Expires"}: {new Date(request.quote.expiresAt).toLocaleDateString(locale === "bn" ? "bn-BD" : "en-BD")}</p>}
                  {request.status === "QUOTED" && <AcceptQuoteForm requestId={request.id} />}
                </div>
              )}
              {(request.status === "OPEN" || request.status === "QUOTED") && <CancelRequestForm requestId={request.id} />}
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="orders" className="scroll-mt-24 flex flex-col gap-4">
        <h2 className="text-xl font-bold">{locale === "bn" ? "অর্ডার ও বুকিং" : "Orders and bookings"}</h2>
        {workspace.orders.length === 0 ? <Empty text={t.workflow.noRecords} /> : workspace.orders.map((order) => <OrderCard key={order.id} order={order} actorId={user.id} perspective="buyer" />)}
      </section>

      <section id="projects" className="scroll-mt-24 flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><h2 className="text-xl font-bold">{t.workflow.projectTitle}</h2><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? "নির্মাণকাজ, দরপ্রস্তাব, ধাপ ও ব্যয় একসাথে দেখুন।" : "Track construction scope, quotes, milestones and recorded costs."}</p></div>
          <Link href="/account/projects/new" className={buttonVariants({ size: "sm" })}>{t.workflow.createProject}</Link>
        </div>
        {workspace.projects.length === 0 ? <Empty text={t.workflow.noRecords} /> : workspace.projects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3"><div><CardTitle>{project.title}</CardTitle><CardDescription>{project.projectType} · {project.district}{project.approximateArea ? ` · ${project.approximateArea}` : ""}</CardDescription></div><StatusBadge status={project.status} /></CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="whitespace-pre-line text-sm text-muted-foreground">{project.description}</p>
              {project.budget && <p className="text-sm">{t.workflow.budget}: {formatMoney(project.budget)}</p>}
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm">{project.orders.length} {locale === "bn" ? "টি অর্ডার/দরপ্রস্তাব গ্রহণ" : "accepted quote orders"} · {project.milestones.length} {t.workflow.milestones}</p><Link href={`/account/projects/${project.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>{locale === "bn" ? "প্রকল্প খুলুন" : "Open project"}</Link></div>
              {project.milestones.length > 0 && <MilestoneList milestones={project.milestones} owner />}
              <AddMilestoneForm projectId={project.id} />
              {project.documents.length > 0 && <div><h3 className="font-semibold">{t.workflow.projectDocuments}</h3>{project.documents.map((document) => <p key={document.id} className="mt-1 text-sm">{document.filename}</p>)}</div>}
            </CardContent>
          </Card>
        ))}
      </section>

      <section id="notifications" className="scroll-mt-24 flex flex-col gap-3">
        <h2 className="text-xl font-bold">{t.dashboard.notifications}</h2>
        {workspace.notifications.length === 0 ? <Empty text={t.workflow.noRecords} /> : workspace.notifications.map((notification) => (
          <div key={notification.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3">
            <div><p className="font-medium">{locale === "bn" ? notification.titleBn : notification.titleEn}</p><p className="mt-1 text-sm text-muted-foreground">{locale === "bn" ? notification.messageBn : notification.messageEn}</p></div>
            {notification.href && <Link href={notification.href} className="text-sm font-medium text-primary hover:underline">{locale === "bn" ? "দেখুন" : "Open"}</Link>}
            {!notification.readAt && <MarkReadForm notificationId={notification.id} />}
          </div>
        ))}
      </section>
    </WorkspaceNavigation>
  );
}

function ProfileForm({ user }: { user: { name: string; email: string; phone: string } }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialWorkflowState);
  const { t } = useLanguage();
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <Field id="account-name" label={t.auth.name} icon={<UserRoundIcon aria-hidden="true" className="size-4" />}>
        <Input id="account-name" name="name" autoComplete="name" defaultValue={user.name} required maxLength={120} />
      </Field>
      <Field id="account-phone" label={t.auth.phone} icon={<PhoneIcon aria-hidden="true" className="size-4" />}>
        <Input id="account-phone" name="phone" type="tel" autoComplete="tel" defaultValue={user.phone} required maxLength={30} />
      </Field>
      <Field id="account-email" label={t.auth.email} icon={<MailIcon aria-hidden="true" className="size-4" />}>
        <Input id="account-email" type="email" autoComplete="email" value={user.email} readOnly />
      </Field>
      <div className="flex flex-col justify-end gap-2">
        <ActionFeedback state={state} />
        <Button type="submit" disabled={pending}>{pending ? t.common.loading : t.auth.submit}</Button>
      </div>
    </form>
  );
}

function AcceptQuoteForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(acceptQuoteAction, initialWorkflowState);
  const { locale, t } = useLanguage();
  return <form action={action} className="mt-4 flex flex-col gap-2"><input type="hidden" name="requestId" value={requestId} /><ActionFeedback state={state} /><p className="text-xs text-muted-foreground">{locale === "bn" ? "গ্রহণ করলে মূল্য, পরিমাণ ও বুকিংয়ের শর্ত নিশ্চিত হবে।" : "Accepting confirms the quoted price, quantity and booking terms."}</p><Button type="submit" disabled={pending} className="w-fit">{pending ? t.common.loading : t.workflow.acceptQuote}</Button></form>;
}

function CancelRequestForm({ requestId }: { requestId: string }) {
  const [state, action, pending] = useActionState(cancelMarketplaceRequestAction, initialWorkflowState);
  const { locale } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="requestId" value={requestId} /><ActionFeedback state={state} /><Button type="submit" variant="ghost" size="sm" disabled={pending} className="w-fit text-muted-foreground">{locale === "bn" ? "অনুরোধ প্রত্যাহার করুন" : "Withdraw request"}</Button></form>;
}

function MarkReadForm({ notificationId }: { notificationId: string }) {
  const [state, action, pending] = useActionState(markNotificationReadAction, initialWorkflowState);
  const { locale } = useLanguage();
  return <form action={action} className="flex flex-col gap-2"><input type="hidden" name="notificationId" value={notificationId} /><Button type="submit" variant="ghost" size="sm" disabled={pending}>{locale === "bn" ? "পড়া হয়েছে" : "Mark read"}</Button><ActionFeedback state={state} /></form>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">{text}</div>;
}

function Field({ id, label, icon, children }: { id: string; label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <div className="flex flex-col gap-2"><Label htmlFor={id} className="flex items-center gap-2">{icon}{label}</Label>{children}</div>;
}
