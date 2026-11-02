import { Resend } from "resend";

export async function sendAuthEmail(to: string, subject: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !from) {
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
    console.error("Authentication email delivery failed.", error.name);
    throw new Error("Account email could not be delivered.");
  }
}
