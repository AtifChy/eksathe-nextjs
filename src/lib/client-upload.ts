"use client";

type ListingImageDetails = { purpose: "listing-image"; sectorSlug: string; kind: string };
type ProjectDocumentDetails = { purpose: "project-document"; projectId: string };
type PaymentReceiptDetails = { purpose: "payment-receipt"; orderId: string };
type CropDiseasePhotoDetails = { purpose: "crop-disease-photo" };
type StorefrontImageDetails = { purpose: "provider-storefront-image"; imageType: "profile" | "cover" };

export async function uploadPrivateFile(file: File, details: ListingImageDetails | ProjectDocumentDetails | PaymentReceiptDetails | CropDiseasePhotoDetails | StorefrontImageDetails) {
  const contentType = file.type.toLowerCase();
  const allowed = details.purpose === "listing-image"
    ? ["image/jpeg", "image/png", "image/webp"].includes(contentType) && file.size <= 5_000_000
    : details.purpose === "project-document"
      ? contentType === "application/pdf" && file.size <= 10_000_000
    : details.purpose === "crop-disease-photo" || details.purpose === "provider-storefront-image"
        ? ["image/jpeg", "image/png", "image/webp"].includes(contentType) && file.size <= 5_000_000
        : ["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(contentType) && file.size <= 10_000_000;
  if (!allowed) throw new Error("invalid-file");

  const response = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...details, contentType, sizeBytes: file.size }),
  });
  if (!response.ok) throw new Error("upload-failed");
  const payload = await response.json() as { key?: unknown; url?: unknown };
  if (typeof payload.key !== "string" || typeof payload.url !== "string") throw new Error("upload-failed");

  const uploaded = await fetch(payload.url, { method: "PUT", headers: { "Content-Type": contentType }, body: file });
  if (!uploaded.ok) throw new Error("upload-failed");
  return { key: payload.key, contentType, sizeBytes: String(file.size) };
}
