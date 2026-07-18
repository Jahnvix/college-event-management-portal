import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-background-elevated px-3 py-2 text-sm outline-none transition placeholder:text-muted focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
