"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveAgriculturePublicationAction } from "@/app/actions/agriculture-publishing";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AgricultureMarketPriceRecord,
  AgriculturePublishingWorkspaceData,
  AgricultureUpdateRecord,
} from "@/lib/agriculture/publishing-types";
import { initialWorkflowState } from "@/lib/workflow-state";

export function AgriculturePublishingWorkspace({
  data,
  isSuperAdmin,
}: {
  data: AgriculturePublishingWorkspaceData;
  isSuperAdmin: boolean;
}) {
  const { locale } = useLanguage();
  const english = locale === "en";
  return (
    <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-primary text-sm font-semibold">
            {english ? "Agriculture operations" : "কৃষি পরিচালনা"}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {english ? "Publish prices and updates" : "বাজারদর ও আপডেট প্রকাশ"}
          </h1>
          <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
            {english
              ? "Review submitted information, add a source and observation date, then publish it for customers."
              : "জমা দেওয়া তথ্য যাচাই করে উৎস ও পর্যবেক্ষণের তারিখ যোগ করে গ্রাহকদের জন্য প্রকাশ করুন।"}
          </p>
        </div>
        <Link href="/admin" className="text-primary text-sm font-medium hover:underline">
          {english ? "Back to administration" : "প্রশাসনে ফিরে যান"}
        </Link>
      </header>

      <section className="flex flex-col gap-4" aria-labelledby="price-heading">
        <div>
          <h2 id="price-heading" className="text-xl font-bold">
            {english ? "Market prices" : "বাজারদর"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {english ? "Price submissions awaiting review" : "পর্যালোচনার অপেক্ষায় থাকা বাজারদরের অনুরোধ"}
          </p>
        </div>
        {data.requests.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {data.requests.map((request) => (
              <Card key={request.id} size="sm">
                <CardHeader>
                  <CardTitle className="text-base">
                    {request.referenceCode ?? `#${request.id}`} · {request.district}
                  </CardTitle>
                  <CardDescription>
                    {english ? "Submitted price information" : "জমা দেওয়া বাজারদরের তথ্য"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/60 max-h-36 overflow-auto rounded-lg p-3 text-xs break-words whitespace-pre-wrap">
                    {JSON.stringify(request.answers, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {data.prices.map((price) => (
          <PriceForm key={price.id} initial={price} requests={data.requests} />
        ))}
        <PriceForm requests={data.requests} />
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="updates-heading">
        <div>
          <h2 id="updates-heading" className="text-xl font-bold">
            {english ? "News, advice, and weather alerts" : "খবর, পরামর্শ ও আবহাওয়া সতর্কতা"}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            {english
              ? "Weather alerts require an expiry date."
              : "আবহাওয়া সতর্কতার মেয়াদ শেষের তারিখ দিতে হবে।"}
          </p>
        </div>
        {data.updates.map((update) => (
          <UpdateForm key={update.id} initial={update} />
        ))}
        <UpdateForm />
      </section>

      {isSuperAdmin && <SupportForm initial={data.support} />}
    </main>
  );
}

function PriceForm({
  initial,
  requests,
}: {
  initial?: AgricultureMarketPriceRecord;
  requests: AgriculturePublishingWorkspaceData["requests"];
}) {
  const [state, action, pending] = useActionState(
    saveAgriculturePublicationAction,
    initialWorkflowState,
  );
  const { locale } = useLanguage();
  const english = locale === "en";
  const prefix = `market-price-${initial?.id ?? "new"}`;
  const sourceOptions: [string, string][] = [
    ["", english ? "No linked request" : "কোনো অনুরোধ নয়"],
    ...requests.map(
      (request) =>
        [
          String(request.id),
          `${request.referenceCode ?? `#${request.id}`} · ${request.district}`,
        ] as [string, string],
    ),
  ];
  if (
    initial?.sourceRequestId &&
    !requests.some((request) => String(request.id) === initial.sourceRequestId)
  )
    sourceOptions.push([
      initial.sourceRequestId,
      `${english ? "Linked request" : "যুক্ত অনুরোধ"} #${initial.sourceRequestId}`,
    ]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {initial
            ? english
              ? `Edit ${initial.productEn}`
              : `${initial.productBn} সম্পাদনা`
            : english
              ? "Add market price"
              : "নতুন বাজারদর যোগ করুন"}
        </CardTitle>
        <CardDescription>
          {english
            ? `${initial?.status ?? "DRAFT"} · linked submissions remain an audit reference`
            : `${initial?.status ?? "DRAFT"} · জমা দেওয়া অনুরোধের সঙ্গে সংযোগ অডিটের জন্য থাকবে`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="type" value="price" />
          {initial && <input type="hidden" name="id" value={initial.id} />}
          <FieldGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField
              id={`${prefix}-product-bn`}
              name="productBn"
              label={english ? "Product name (Bangla)" : "পণ্যের নাম (বাংলা)"}
              defaultValue={initial?.productBn}
              required
            />
            <TextField
              id={`${prefix}-product-en`}
              name="productEn"
              label={english ? "Product name (English)" : "পণ্যের নাম (ইংরেজি)"}
              defaultValue={initial?.productEn}
              required
            />
            <TextField
              id={`${prefix}-market`}
              name="market"
              label={english ? "Market" : "বাজার"}
              defaultValue={initial?.market}
              required
            />
            <TextField
              id={`${prefix}-district`}
              name="district"
              label={english ? "District" : "জেলা"}
              defaultValue={initial?.district}
              required
            />
            <TextField
              id={`${prefix}-unit`}
              name="unit"
              label={english ? "Unit (e.g. kg)" : "একক (যেমন কেজি)"}
              defaultValue={initial?.unit}
              required
            />
            <TextField
              id={`${prefix}-price`}
              name="price"
              label={english ? "Price (BDT)" : "দাম (টাকা)"}
              type="number"
              min="0"
              step="0.01"
              defaultValue={initial?.price}
              required
            />
            <TextField
              id={`${prefix}-observed`}
              name="observedAt"
              label={english ? "Observed on" : "পর্যবেক্ষণের তারিখ"}
              type="date"
              defaultValue={initial?.observedAt}
              required
            />
            <TextField
              id={`${prefix}-source`}
              name="source"
              label={english ? "Source" : "তথ্যসূত্র"}
              defaultValue={initial?.source}
              required
            />
            <SelectField
              id={`${prefix}-status`}
              name="status"
              label={english ? "Publication status" : "প্রকাশনার অবস্থা"}
              defaultValue={initial?.status ?? "DRAFT"}
              options={[
                ["DRAFT", english ? "Draft" : "খসড়া"],
                ["PUBLISHED", english ? "Published" : "প্রকাশিত"],
              ]}
            />
            <SelectField
              id={`${prefix}-request`}
              name="sourceRequestId"
              label={english ? "Link a price submission" : "বাজারদরের অনুরোধ যুক্ত করুন"}
              defaultValue={initial?.sourceRequestId ?? ""}
              options={sourceOptions}
            />
          </FieldGroup>
          <FormFeedback state={state.status} />
          <Button type="submit" disabled={pending}>
            {pending
              ? english
                ? "Saving…"
                : "সংরক্ষণ হচ্ছে…"
              : english
                ? "Save market price"
                : "বাজারদর সংরক্ষণ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function UpdateForm({ initial }: { initial?: AgricultureUpdateRecord }) {
  const [state, action, pending] = useActionState(
    saveAgriculturePublicationAction,
    initialWorkflowState,
  );
  const { locale } = useLanguage();
  const english = locale === "en";
  const prefix = `agriculture-update-${initial?.id ?? "new"}`;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {initial
            ? english
              ? `Edit ${initial.titleEn}`
              : `${initial.titleBn} সম্পাদনা`
            : english
              ? "Add an update"
              : "নতুন আপডেট যোগ করুন"}
        </CardTitle>
        <CardDescription>
          {english
            ? `${initial?.status ?? "DRAFT"} · ${initial?.kind ?? "NEWS"}`
            : `${initial?.status ?? "DRAFT"} · ${initial?.kind ?? "NEWS"}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="type" value="update" />
          {initial && <input type="hidden" name="id" value={initial.id} />}
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <SelectField
              id={`${prefix}-kind`}
              name="kind"
              label={english ? "Type" : "ধরন"}
              defaultValue={initial?.kind ?? "NEWS"}
              options={[
                ["NEWS", english ? "News" : "খবর"],
                ["ADVICE", english ? "Advice" : "পরামর্শ"],
                ["WEATHER_ALERT", english ? "Weather alert" : "আবহাওয়া সতর্কতা"],
              ]}
            />
            <SelectField
              id={`${prefix}-status`}
              name="status"
              label={english ? "Publication status" : "প্রকাশনার অবস্থা"}
              defaultValue={initial?.status ?? "DRAFT"}
              options={[
                ["DRAFT", english ? "Draft" : "খসড়া"],
                ["PUBLISHED", english ? "Published" : "প্রকাশিত"],
              ]}
            />
            <TextField
              id={`${prefix}-title-bn`}
              name="titleBn"
              label={english ? "Title (Bangla)" : "শিরোনাম (বাংলা)"}
              defaultValue={initial?.titleBn}
              required
            />
            <TextField
              id={`${prefix}-title-en`}
              name="titleEn"
              label={english ? "Title (English)" : "শিরোনাম (ইংরেজি)"}
              defaultValue={initial?.titleEn}
              required
            />
            <TextField
              id={`${prefix}-published`}
              name="publishedAt"
              label={english ? "Publication date" : "প্রকাশের তারিখ"}
              type="date"
              defaultValue={initial?.publishedAt}
              required
            />
            <TextField
              id={`${prefix}-expiry`}
              name="expiresAt"
              label={
                english
                  ? "Expiry date (required for weather alerts)"
                  : "মেয়াদ শেষের তারিখ (আবহাওয়া সতর্কতার জন্য প্রয়োজন)"
              }
              type="date"
              defaultValue={initial?.expiresAt}
            />
            <TextField
              id={`${prefix}-source`}
              name="source"
              label={english ? "Source" : "তথ্যসূত্র"}
              defaultValue={initial?.source}
              required
            />
            <TextAreaField
              className="sm:col-span-2"
              id={`${prefix}-body-bn`}
              name="bodyBn"
              label={english ? "Content (Bangla)" : "বিস্তারিত (বাংলা)"}
              defaultValue={initial?.bodyBn}
              required
            />
            <TextAreaField
              className="sm:col-span-2"
              id={`${prefix}-body-en`}
              name="bodyEn"
              label={english ? "Content (English)" : "বিস্তারিত (ইংরেজি)"}
              defaultValue={initial?.bodyEn}
              required
            />
          </FieldGroup>
          <FormFeedback state={state.status} />
          <Button type="submit" disabled={pending}>
            {pending
              ? english
                ? "Saving…"
                : "সংরক্ষণ হচ্ছে…"
              : english
                ? "Save update"
                : "আপডেট সংরক্ষণ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function SupportForm({ initial }: { initial: AgriculturePublishingWorkspaceData["support"] }) {
  const [state, action, pending] = useActionState(
    saveAgriculturePublicationAction,
    initialWorkflowState,
  );
  const { locale } = useLanguage();
  const english = locale === "en";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{english ? "Agriculture support contact" : "কৃষি সহায়তার যোগাযোগ"}</CardTitle>
        <CardDescription>
          {english
            ? "These details appear publicly on the agriculture pages. Leave blank to remove a contact method."
            : "এই তথ্য কৃষি পাতায় প্রকাশ্যে দেখা যাবে। যোগাযোগের কোনো মাধ্যম সরাতে ফাঁকা রাখুন।"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="type" value="support" />
          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="agriculture-support-phone"
              name="phone"
              label={english ? "Phone" : "ফোন"}
              defaultValue={initial?.phone}
            />
            <TextField
              id="agriculture-support-email"
              name="email"
              type="email"
              label={english ? "Email" : "ইমেইল"}
              defaultValue={initial?.email}
            />
            <TextAreaField
              className="sm:col-span-2"
              id="agriculture-support-bn"
              name="messageBn"
              label={english ? "Support message (Bangla)" : "সহায়তার বার্তা (বাংলা)"}
              defaultValue={initial?.messageBn}
            />
            <TextAreaField
              className="sm:col-span-2"
              id="agriculture-support-en"
              name="messageEn"
              label={english ? "Support message (English)" : "সহায়তার বার্তা (ইংরেজি)"}
              defaultValue={initial?.messageEn}
            />
          </FieldGroup>
          <FormFeedback state={state.status} />
          <Button type="submit" disabled={pending}>
            {pending
              ? english
                ? "Saving…"
                : "সংরক্ষণ হচ্ছে…"
              : english
                ? "Save support details"
                : "সহায়তার তথ্য সংরক্ষণ"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function TextField({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  required,
  min,
  step,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        min={min}
        step={step}
      />
    </Field>
  );
}

function TextAreaField({
  id,
  name,
  label,
  defaultValue,
  required,
  className,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Textarea id={id} name={name} defaultValue={defaultValue} required={required} rows={4} />
    </Field>
  );
}

function SelectField({
  id,
  name,
  label,
  defaultValue,
  options,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: [string, string][];
}) {
  return (
    <Field className="min-w-0">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="border-input bg-background h-9 w-full rounded-lg border px-3 text-sm"
      >
        <optgroup label={label}>
          {options.map(([value, title]) => (
            <option key={`${value}-${title}`} value={value}>
              {title}
            </option>
          ))}
        </optgroup>
      </select>
    </Field>
  );
}

function FormFeedback({ state }: { state: "idle" | "success" | "error" }) {
  const { locale } = useLanguage();
  if (state === "idle") return null;
  return (
    <p
      role={state === "error" ? "alert" : "status"}
      aria-live="polite"
      className={state === "error" ? "text-destructive text-sm" : "text-primary text-sm"}
    >
      {state === "error"
        ? locale === "en"
          ? "Could not save. Check the fields and try again."
          : "সংরক্ষণ করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।"
        : locale === "en"
          ? "Saved."
          : "সংরক্ষিত হয়েছে।"}
    </p>
  );
}
