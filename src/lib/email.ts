import { Resend } from "resend";

function previewEmailInDevelopment(subject: string, url: string, reason: string) {
  if (process.env.NODE_ENV === "production") return false;

  console.warn(`Development email preview (${reason}): ${subject}\n${url}`);
  return true;
}

export async function sendAuthEmail(to: string, subject: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
    if (previewEmailInDevelopment(subject, url, "Resend is not configured")) return;
    throw new Error("Account email is unavailable because Resend is not configured.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    subject,
    text: `${subject}\n\n${url}\n\nIf you did not request this email, you can ignore it.`,
  });

  if (error) {
    console.error("Authentication email delivery failed.", {
      name: error.name,
      message: error.message,
    });
    if (previewEmailInDevelopment(subject, url, "Resend could not deliver the message")) return;
    throw new Error("Account email could not be delivered.");
  }
}
