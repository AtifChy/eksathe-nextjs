"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requestSchema } from "@/lib/validations/request";

export type RequestFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: number;
  errors?: Record<string, string[] | undefined>;
};

export async function createRequest(
  _prevState: RequestFormState,
  formData: FormData,
): Promise<RequestFormState> {
  const parsed = requestSchema.safeParse({
    panelId: formData.get("panel_id") ?? "",
    customerName: formData.get("customer_name") ?? "",
    phone: formData.get("phone") ?? "",
    district: formData.get("district") ?? "",
    budget: formData.get("budget") ?? "",
    details: formData.get("details") ?? "",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "অনুরোধ জমা হয়নি। নিচের তথ্য যাচাই করুন।",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const panel = await prisma.panel.findFirst({
    where: { id: parsed.data.panelId, isActive: true },
    select: { id: true },
  });

  if (!panel) {
    return {
      status: "error",
      message: "সেবাটি পাওয়া যায়নি। পৃষ্ঠাটি রিফ্রেশ করে আবার চেষ্টা করুন।",
    };
  }

  const request = await prisma.serviceRequest.create({
    data: {
      panelId: panel.id,
      customerName: parsed.data.customerName,
      phone: parsed.data.phone,
      district: parsed.data.district,
      details: parsed.data.details,
      budget: parsed.data.budget,
    },
    select: { id: true },
  });

  return {
    status: "success",
    message: "আপনার অনুরোধ গ্রহণ করা হয়েছে।",
    reference: request.id,
  };
}
