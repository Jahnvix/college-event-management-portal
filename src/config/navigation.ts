import { ROUTES } from "@/constants/routes";

export const siteNavigation = {
  main: [
    {
      href: ROUTES.home,
      label: "Foundation",
    },
    {
      href: "#architecture",
      label: "Architecture",
    },
    {
      href: "#tooling",
      label: "Tooling",
    },
    {
      href: "#quality",
      label: "Quality Gates",
    },
  ],
} as const;
