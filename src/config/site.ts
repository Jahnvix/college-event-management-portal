const defaultUrl = "http://localhost:3000";

export const siteConfig = {
  description:
    "Production-grade college event management platform for student registrations, discovery, announcements, and administration.",
  name: "CampusPulse",
  shortName: "CampusPulse",
  url: process.env.NEXT_PUBLIC_APP_URL ?? defaultUrl,
} as const;
