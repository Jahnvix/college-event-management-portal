import Link from "next/link";

import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <section className="glass-panel w-full max-w-2xl rounded-[2rem] border border-border p-10 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
          <Compass className="size-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-primary">
          Route not found
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground">
          The page you requested does not exist yet.
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted">
          This foundation build intentionally keeps the route surface minimal until the
          student and admin modules are implemented in later phases.
        </p>
        <Button asChild className="mt-8">
          <Link href="/">Return home</Link>
        </Button>
      </section>
    </main>
  );
}
