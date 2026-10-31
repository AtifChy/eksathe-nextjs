"use client";

import { useActionState } from "react";
import { CheckCircle2Icon } from "lucide-react";

import {
  createRequest,
  type RequestFormState,
} from "@/app/actions/create-request";
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
  const [state, formAction, pending] = useActionState(
    createRequest,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-primary/20 bg-secondary p-6 text-center">
        <CheckCircle2Icon className="mx-auto size-9 text-primary" />
        <h3 className="mt-3 text-lg font-semibold">অনুরোধ জমা হয়েছে</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          আপনার রেফারেন্স নম্বর: <strong>#{state.reference}</strong>
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          এটি কেবল অনুরোধ গ্রহণের নিশ্চিতকরণ; সেবা বা পেমেন্ট নিশ্চিত হওয়ার
          অর্থ নয়।
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
        <Label htmlFor={`customer_name_${panelId}`}>আপনার নাম *</Label>
        <Input
          id={`customer_name_${panelId}`}
          name="customer_name"
          required
          maxLength={150}
          autoComplete="name"
          aria-invalid={Boolean(state.errors?.customerName)}
        />
        <FieldError messages={state.errors?.customerName} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`phone_${panelId}`}>মোবাইল নম্বর *</Label>
        <Input
          id={`phone_${panelId}`}
          name="phone"
          required
          maxLength={30}
          inputMode="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          aria-invalid={Boolean(state.errors?.phone)}
        />
        <FieldError messages={state.errors?.phone} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`district_${panelId}`}>জেলা/এলাকা *</Label>
        <Input
          id={`district_${panelId}`}
          name="district"
          required
          maxLength={100}
          aria-invalid={Boolean(state.errors?.district)}
        />
        <FieldError messages={state.errors?.district} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`budget_${panelId}`}>সম্ভাব্য বাজেট (৳)</Label>
        <Input
          id={`budget_${panelId}`}
          name="budget"
          type="number"
          min={0}
          step="0.01"
          aria-invalid={Boolean(state.errors?.budget)}
        />
        <FieldError messages={state.errors?.budget} />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor={`details_${panelId}`}>
          আপনার প্রয়োজন বিস্তারিত লিখুন *
        </Label>
        <Textarea
          id={`details_${panelId}`}
          name="details"
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
          {pending ? "জমা হচ্ছে..." : "অনুরোধ জমা দিন"}
        </Button>
        <span className="text-xs text-muted-foreground">
          অনুরোধ জমা দিলেই কোনো পেমেন্ট সম্পন্ন হয় না।
        </span>
      </div>
    </form>
  );
}
