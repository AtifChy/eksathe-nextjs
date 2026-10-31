"use client";

import { useActionState } from "react";
import { CheckCircle2Icon } from "lucide-react";

import {
  createRequest,
  type RequestFormState,
} from "@/app/actions/create-request";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: RequestFormState = { status: "idle" };

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;

  return <p className="text-xs text-destructive">{messages[0]}</p>;
}

export function RequestForm({ panelId }: { panelId: number }) {
  const { t } = useLanguage();
  const [state, formAction, pending] = useActionState(
    createRequest,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-secondary p-6 text-center">
        <CheckCircle2Icon className="mx-auto size-9 text-primary" />
        <h3 className="mt-3 text-lg font-semibold">{t.requestForm.successTitle}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.requestForm.successReference} <strong>#{state.reference}</strong>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {t.requestForm.successNotice}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="panel_id" value={panelId} />

      {state.status === "error" && state.message ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2">
          {state.message}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor={`customer_name_${panelId}`}>{t.requestForm.fullName}</Label>
        <Input
          id={`customer_name_${panelId}`}
          name="customer_name"
          placeholder={t.requestForm.fullNamePlaceholder}
          required
          maxLength={150}
          autoComplete="name"
          aria-invalid={Boolean(state.errors?.customerName)}
        />
        <FieldError messages={state.errors?.customerName} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`phone_${panelId}`}>{t.requestForm.phone}</Label>
        <Input
          id={`phone_${panelId}`}
          name="phone"
          required
          maxLength={30}
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.requestForm.phonePlaceholder}
          aria-invalid={Boolean(state.errors?.phone)}
        />
        <FieldError messages={state.errors?.phone} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`district_${panelId}`}>{t.requestForm.district}</Label>
        <Input
          id={`district_${panelId}`}
          name="district"
          placeholder={t.requestForm.districtPlaceholder}
          required
          maxLength={100}
          aria-invalid={Boolean(state.errors?.district)}
        />
        <FieldError messages={state.errors?.district} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`budget_${panelId}`}>{t.requestForm.budget}</Label>
        <Input
          id={`budget_${panelId}`}
          name="budget"
          placeholder={t.requestForm.budgetPlaceholder}
          type="number"
          min={0}
          step="0.01"
          aria-invalid={Boolean(state.errors?.budget)}
        />
        <FieldError messages={state.errors?.budget} />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`details_${panelId}`}>
          {t.requestForm.details}
        </Label>
        <Textarea
          id={`details_${panelId}`}
          name="details"
          placeholder={t.requestForm.detailsPlaceholder}
          rows={4}
          required
          minLength={10}
          maxLength={5000}
          aria-invalid={Boolean(state.errors?.details)}
        />
        <FieldError messages={state.errors?.details} />
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? t.requestForm.submitting : t.requestForm.submit}
        </Button>
        <span className="text-xs text-muted-foreground">
          {t.requestForm.disclaimer}
        </span>
      </div>
    </form>
  );
}
