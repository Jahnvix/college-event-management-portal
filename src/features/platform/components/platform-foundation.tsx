"use client";

import Link from "next/link";

import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  GitBranchPlus,
  Layers3,
} from "lucide-react";

import { siteNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { foundationCards } from "@/features/platform/data/foundation-cards";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      delay,
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
    y: 0,
  }),
};

const qualityGates = [
  "Strict TypeScript with zero build-time suppression",
  "Flat-config ESLint and Prettier with Tailwind sorting",
  "Jest and Playwright wired for future phases",
  "Husky and lint-staged ready for atomic commits",
] as const;

export function PlatformFoundation() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-12">
      <motion.header
        animate="visible"
        className="glass-panel sticky top-4 z-20 flex items-center justify-between rounded-full border border-border px-5 py-3"
        custom={0.05}
        initial="hidden"
        variants={fadeInUp}
      >
        <div>
          <p className="font-display text-lg font-bold tracking-tight text-foreground">
            {siteConfig.name}
          </p>
          <p className="text-xs uppercase tracking-[0.32em] text-muted">
            Phase 1 • System foundation
          </p>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          {siteNavigation.main.map((item) => (
            <Link
              key={item.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </motion.header>

      <section className="grid flex-1 items-start gap-8 pb-10 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
        <motion.div
          animate="visible"
          className="space-y-8"
          custom={0.12}
          initial="hidden"
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background-elevated px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <Layers3 className="size-4" />
            Production-ready initialization
          </div>
          <div className="space-y-5">
            <h1 className="max-w-4xl font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              The portal foundation is live with architecture, tooling, and quality
              rails in place.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              This phase intentionally focuses on long-term maintainability: clean
              project boundaries, shared providers, design tokens, test tooling, and
              production-safe defaults that future student and admin modules can build
              on without rework.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href="#architecture">
                Review architecture
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#quality">
                See quality gates
                <FileCode2 className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Primary stack", value: "Next.js 15 + React 19" },
              { label: "Architecture", value: "Feature-first src layout" },
              { label: "Delivery model", value: "Phase-based, compile-safe" },
            ].map((item) => (
              <div
                key={item.label}
                className="glass-panel rounded-[1.5rem] border border-border p-5"
              >
                <p className="text-sm text-muted">{item.label}</p>
                <p className="mt-3 text-base font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.aside
          animate="visible"
          className="glass-panel rounded-[2rem] border border-border p-6"
          custom={0.2}
          id="quality"
          initial="hidden"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-accent-soft p-3 text-accent">
              <GitBranchPlus className="size-5" />
            </div>
            <div>
              <p className="font-display text-xl font-bold">Quality gates</p>
              <p className="text-sm text-muted">
                Every future phase must clear these checks before approval.
              </p>
            </div>
          </div>
          <ul className="mt-6 space-y-4">
            {qualityGates.map((gate) => (
              <li key={gate} className="flex gap-3 text-sm leading-6 text-muted">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{gate}</span>
              </li>
            ))}
          </ul>
        </motion.aside>
      </section>

      <section className="space-y-6" id="architecture">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
            Architecture choices
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
            A scalable baseline designed for clean phases, not throwaway scaffolding.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {foundationCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.article
                key={card.title}
                animate="visible"
                className="glass-panel rounded-[1.75rem] border border-border p-6"
                custom={0.16 + index * 0.05}
                initial="hidden"
                variants={fadeInUp}
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-foreground">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </section>

      <footer
        className="mt-10 flex flex-col gap-4 border-t border-border/80 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between"
        id="tooling"
      >
        <p>{siteConfig.description}</p>
        <p className="font-medium text-foreground">Ready for Phase 2: data layer.</p>
      </footer>
    </main>
  );
}
