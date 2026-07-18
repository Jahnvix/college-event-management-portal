import {
  Blocks,
  FolderKanban,
  ShieldCheck,
  Sparkles,
  TestTube2,
  Workflow,
} from "lucide-react";

export const foundationCards = [
  {
    description:
      "App Router foundation with strict TypeScript, typed routes, and server-first rendering boundaries.",
    icon: Workflow,
    points: ["Next.js 15", "React 19", "Strict TS", "Typed routes"],
    title: "Application Core",
  },
  {
    description:
      "Feature-oriented modules and shared primitives keep future student and admin flows isolated and maintainable.",
    icon: FolderKanban,
    points: ["src/app", "src/features", "src/components", "src/config"],
    title: "Module Boundaries",
  },
  {
    description:
      "Theme, query, toast, and utility layers are centralized so later phases can scale without cross-cutting duplication.",
    icon: Blocks,
    points: ["Theme provider", "React Query", "Sonner", "CVA utilities"],
    title: "Shared Infrastructure",
  },
  {
    description:
      "Quality gates are installed from day one to protect regressions and keep every phase production-grade.",
    icon: TestTube2,
    points: ["ESLint", "Prettier", "Jest", "Playwright"],
    title: "Quality Tooling",
  },
  {
    description:
      "Security-conscious defaults are enabled early so authentication and admin workflows have a safer baseline.",
    icon: ShieldCheck,
    points: ["Secure headers", "Strict config", "No build-time ignores", "Husky"],
    title: "Delivery Guardrails",
  },
  {
    description:
      "A premium visual foundation is already in place with local fonts, glass surfaces, and responsive layout rhythm.",
    icon: Sparkles,
    points: ["Local fonts", "Theme tokens", "Responsive shell", "Micro motion"],
    title: "Design Foundation",
  },
] as const;
