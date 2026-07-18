import { Resend } from "resend";

import { getServerEnv } from "@/server/env";

type SendEmailInput = {
  html: string;
  subject: string;
  text: string;
  to: string;
};

export async function sendTransactionalEmail(input: SendEmailInput) {
  const env = getServerEnv();

  if (!env.RESEND_API_KEY) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is required to send transactional email.");
    }

    return { id: null, skipped: true };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const result = await resend.emails.send({
    from: env.EMAIL_FROM ?? "CampusPulse <onboarding@resend.dev>",
    html: input.html,
    subject: input.subject,
    text: input.text,
    to: input.to,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  return { id: result.data?.id ?? null, skipped: false };
}
