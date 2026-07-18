import { siteConfig } from "@/config/site";

export function buildVerificationEmail(input: { name: string; token: string }) {
  const url = `${siteConfig.url}/verify-email?token=${encodeURIComponent(
    input.token,
  )}`;

  return {
    html: `<p>Hi ${input.name},</p><p>Verify your CampusPulse account using this link:</p><p><a href="${url}">${url}</a></p>`,
    subject: "Verify your CampusPulse account",
    text: `Hi ${input.name}, verify your CampusPulse account: ${url}`,
  };
}

export function buildPasswordResetEmail(input: { name: string; token: string }) {
  const url = `${siteConfig.url}/reset-password?token=${encodeURIComponent(
    input.token,
  )}`;

  return {
    html: `<p>Hi ${input.name},</p><p>Reset your CampusPulse password using this link:</p><p><a href="${url}">${url}</a></p>`,
    subject: "Reset your CampusPulse password",
    text: `Hi ${input.name}, reset your CampusPulse password: ${url}`,
  };
}
