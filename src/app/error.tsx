"use client";

import { useEffect } from "react";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <main className="glass-panel w-full max-w-xl rounded-[2rem] border border-border p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-soft text-accent">
            <AlertTriangle className="size-7" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
            Something unexpected happened.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            The application shell is still healthy, but this request hit an unexpected
            runtime error. You can retry safely.
          </p>
          <Button className="mt-8" onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
        </main>
      </body>
    </html>
  );
}
