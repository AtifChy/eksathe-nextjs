"use client";

import { useActionState } from "react";

import { updateAgricultureServiceRequestAction } from "@/app/actions/agriculture";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionFeedback } from "@/components/workflows/action-feedback";
import { StatusBadge } from "@/components/workflows/status-badge";
import { agricultureServiceRegistry } from "@/lib/agriculture/service-registry";
import { initialWorkflowState } from "@/lib/workflow-state";
import type { AdminWorkspace } from "@/lib/workspaces";

type QueueRequest = AdminWorkspace["agricultureRequests"][number];
type QueueStaff = AdminWorkspace["agricultureStaff"][number];

export function AgricultureRequestsQueue({
  requests,
  staff,
  filters,
}: {
  requests: QueueRequest[];
  staff: QueueStaff[];
  filters: AdminWorkspace["agricultureFilters"];
}) {
  const { locale } = useLanguage();
  const english = locale === "en";
  return (
    <section id="agriculture-requests" className="flex scroll-mt-24 flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">
          {english ? "Agriculture service intake" : "কৃষি সেবা অনুরোধ"}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">
          {english
            ? "Review requests, coordinate follow-up, and keep internal notes private."
            : "অনুরোধ যাচাই, সমন্বয় এবং ব্যক্তিগত অভ্যন্তরীণ নোট সংরক্ষণ করুন।"}
        </p>
      </div>
      <form
        method="get"
        action="/admin#agriculture-requests"
        className="bg-card grid gap-3 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Field id="ag-filter-service" label={english ? "Service" : "সেবা"}>
          <select
            id="ag-filter-service"
            name="agService"
            defaultValue={filters.serviceSlug ?? ""}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">{english ? "All services" : "সব সেবা"}</option>
            {agricultureServiceRegistry.map((service) => (
              <option key={service.slug} value={service.slug}>
                {english ? service.titleEn : service.titleBn}
              </option>
            ))}
          </select>
        </Field>
        <Field id="ag-filter-district" label={english ? "District" : "জেলা"}>
          <Input id="ag-filter-district" name="agDistrict" defaultValue={filters.district ?? ""} />
        </Field>
        <Field id="ag-filter-status" label={english ? "Status" : "অবস্থা"}>
          <select
            id="ag-filter-status"
            name="agStatus"
            defaultValue={filters.status ?? ""}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">{english ? "All statuses" : "সব অবস্থা"}</option>
            {["NEW", "REVIEWING", "ASSIGNED", "COMPLETED", "REJECTED", "CANCELLED"].map(
              (status) => (
                <option key={status} value={status}>
                  {statusLabel(status, english)}
                </option>
              ),
            )}
          </select>
        </Field>
        <Field id="ag-filter-assignee" label={english ? "Assignee" : "দায়িত্বপ্রাপ্ত"}>
          <select
            id="ag-filter-assignee"
            name="agAssignee"
            defaultValue={filters.assigneeId ?? ""}
            className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
          >
            <option value="">{english ? "Anyone" : "সব কর্মী"}</option>
            {staff.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name} · {person.email}
              </option>
            ))}
          </select>
        </Field>
        <Field id="ag-filter-from" label={english ? "From date" : "শুরুর তারিখ"}>
          <Input
            id="ag-filter-from"
            name="agFrom"
            type="date"
            defaultValue={filters.dateFrom ?? ""}
          />
        </Field>
        <Field id="ag-filter-to" label={english ? "To date" : "শেষ তারিখ"}>
          <Input id="ag-filter-to" name="agTo" type="date" defaultValue={filters.dateTo ?? ""} />
        </Field>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
          <Button type="submit" variant="outline">
            {english ? "Filter requests" : "অনুরোধ ফিল্টার করুন"}
          </Button>
          <a
            href="/admin#agriculture-requests"
            className="text-muted-foreground hover:bg-muted inline-flex h-9 items-center rounded-lg px-3 text-sm"
          >
            {english ? "Clear" : "মুছুন"}
          </a>
        </div>
      </form>
      {requests.length === 0 ? (
        <div className="text-muted-foreground rounded-xl border border-dashed p-6 text-sm">
          {english
            ? "No agriculture requests match these filters."
            : "এই ফিল্টারে কোনো কৃষি অনুরোধ পাওয়া যায়নি।"}
        </div>
      ) : (
        requests.map((request) => <RequestCard key={request.id} request={request} staff={staff} />)
      )}
    </section>
  );
}

function RequestCard({ request, staff }: { request: QueueRequest; staff: QueueStaff[] }) {
  const [state, action, pending] = useActionState(
    updateAgricultureServiceRequestAction,
    initialWorkflowState,
  );
  const { locale } = useLanguage();
  const english = locale === "en";
  const snapshot = request.fieldSnapshot as {
    fields?: Array<{
      name: string;
      labelBn: string;
      labelEn: string;
      options?: Array<{ value: string; labelBn: string; labelEn: string }>;
    }>;
  };
  const answers = request.answers as Record<string, string>;
  const choices = allowedStatuses(request.status);
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg">
            {request.service.icon} {english ? request.service.titleEn : request.service.titleBn}
          </CardTitle>
          <CardDescription>
            {request.referenceCode ?? `AG-${request.id}`} · {request.customerName} ·{" "}
            {request.customerEmail} · {request.phone} · {request.district}
          </CardDescription>
          <CardDescription>
            {request.createdAt
              ? new Date(request.createdAt).toLocaleString(english ? "en-BD" : "bn-BD")
              : ""}{" "}
            · {english ? "Assignee" : "দায়িত্বপ্রাপ্ত"}:{" "}
            {request.assignedTo?.name ?? (english ? "Not assigned" : "দায়িত্ব দেওয়া হয়নি")}
          </CardDescription>
        </div>
        <StatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="bg-muted/50 rounded-lg p-3">
          <p className="text-sm font-medium">{request.details}</p>
          {request.budget && (
            <p className="text-muted-foreground mt-1 text-xs">
              {english ? "Budget" : "বাজেট"}: ৳{request.budget}
            </p>
          )}
        </div>
        {snapshot.fields?.some((field) => answers[field.name]) && (
          <dl className="grid gap-2 sm:grid-cols-2">
            {snapshot.fields
              .filter((field) => answers[field.name])
              .map((field) => {
                const answer = answers[field.name];
                const option = field.options?.find((item) => item.value === answer);
                return (
                  <div key={field.name} className="rounded-lg border p-3">
                    <dt className="text-muted-foreground text-xs">
                      {english ? field.labelEn : field.labelBn}
                    </dt>
                    <dd className="mt-1 text-sm">
                      {option ? (english ? option.labelEn : option.labelBn) : answer}
                    </dd>
                  </div>
                );
              })}
          </dl>
        )}
        {request.attachments.length > 0 && (
          <div>
            <p className="text-sm font-semibold">
              {english ? "Private attachments" : "ব্যক্তিগত সংযুক্তি"}
            </p>
            {request.attachments.map((attachment) => (
              <a
                key={attachment.id}
                className="text-primary mt-1 block w-fit text-sm hover:underline"
                href={`/api/agriculture/requests/${request.id}/attachments/${attachment.id}`}
              >
                {attachment.filename}
              </a>
            ))}
          </div>
        )}
        {request.marketplaceRequest && (
          <p className="text-sm">
            {english ? "Marketplace match" : "মার্কেটপ্লেস সংযোগ"}:{" "}
            {english
              ? request.marketplaceRequest.listing.titleEn
              : request.marketplaceRequest.listing.titleBn}
          </p>
        )}
        {request.updates.map((update) => (
          <div
            key={update.id}
            className={`rounded-lg p-3 text-sm ${update.visibility === "INTERNAL" ? "border border-amber-500/30 bg-amber-500/5" : "bg-muted/40 border"}`}
          >
            <p className="text-muted-foreground mb-1 text-xs font-semibold">
              {update.visibility === "INTERNAL"
                ? english
                  ? "Internal note"
                  : "অভ্যন্তরীণ নোট"
                : english
                  ? "Customer update"
                  : "গ্রাহক আপডেট"}
            </p>
            <p>
              {english
                ? (update.messageEn ?? update.messageBn)
                : (update.messageBn ?? update.messageEn)}
            </p>
          </div>
        ))}
        <form action={action} className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2">
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="locale" value={locale} />
          <Field id={`ag-status-${request.id}`} label={english ? "Status" : "অবস্থা"}>
            <select
              id={`ag-status-${request.id}`}
              name="status"
              defaultValue={request.status}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
            >
              {choices.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status, english)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id={`ag-assignee-${request.id}`}
            label={english ? "Assign to staff" : "কর্মীকে দায়িত্ব দিন"}
          >
            <select
              id={`ag-assignee-${request.id}`}
              name="assignedToId"
              defaultValue={request.assignedTo?.id ?? staff[0]?.id ?? ""}
              className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
              required
            >
              {staff.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name} · {person.email}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id={`ag-market-match-${request.id}`}
            label={
              english
                ? "Matched marketplace request ID (optional)"
                : "মিল থাকা মার্কেটপ্লেস অনুরোধ আইডি (ঐচ্ছিক)"
            }
          >
            <Input
              id={`ag-market-match-${request.id}`}
              name="marketplaceRequestId"
              maxLength={64}
              defaultValue={request.marketplaceRequest?.id ?? ""}
            />
          </Field>
          <Field
            id={`ag-public-message-${request.id}`}
            label={english ? "Customer-visible update" : "গ্রাহকের জন্য আপডেট"}
          >
            <Textarea
              id={`ag-public-message-${request.id}`}
              name="publicMessage"
              maxLength={2000}
              rows={2}
            />
          </Field>
          <Field
            id={`ag-private-note-${request.id}`}
            label={english ? "Private staff note" : "অভ্যন্তরীণ কর্মী নোট"}
          >
            <Textarea
              id={`ag-private-note-${request.id}`}
              name="privateNote"
              maxLength={2000}
              rows={2}
            />
          </Field>
          <div className="flex flex-col gap-2 sm:col-span-2">
            <ActionFeedback state={state} />
            <Button type="submit" disabled={pending} className="w-fit">
              {pending
                ? english
                  ? "Saving…"
                  : "সংরক্ষণ হচ্ছে…"
                : english
                  ? "Save review"
                  : "পর্যালোচনা সংরক্ষণ"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function allowedStatuses(status: string) {
  const transitions: Record<string, string[]> = {
    NEW: ["NEW", "REVIEWING", "REJECTED", "CANCELLED"],
    REVIEWING: ["REVIEWING", "ASSIGNED", "REJECTED", "CANCELLED"],
    ASSIGNED: ["ASSIGNED", "COMPLETED", "CANCELLED"],
    COMPLETED: ["COMPLETED"],
    REJECTED: ["REJECTED"],
    CANCELLED: ["CANCELLED"],
  };
  return transitions[status] ?? [status];
}

function statusLabel(status: string, english: boolean) {
  const labels: Record<string, [string, string]> = {
    NEW: ["New", "নতুন"],
    REVIEWING: ["Under review", "পর্যালোচনাধীন"],
    ASSIGNED: ["Assigned", "দায়িত্ব দেওয়া হয়েছে"],
    COMPLETED: ["Completed", "সম্পন্ন"],
    REJECTED: ["Rejected", "প্রত্যাখ্যাত"],
    CANCELLED: ["Cancelled", "বাতিল"],
  };
  return labels[status]?.[english ? 0 : 1] ?? status;
}
