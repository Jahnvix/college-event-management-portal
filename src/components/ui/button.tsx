import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform duration-200 outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      size: {
        default: "h-11 px-5 text-sm",
        icon: "size-11",
        lg: "h-12 px-6 text-sm",
        sm: "h-9 px-4 text-sm",
      },
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_18px_50px_rgba(12,74,110,0.22)] hover:-translate-y-0.5 hover:brightness-110",
        ghost: "text-foreground hover:-translate-y-0.5 hover:bg-secondary",
        outline:
          "border border-border bg-background-elevated text-foreground hover:-translate-y-0.5 hover:bg-secondary",
        secondary: "bg-secondary text-secondary-foreground hover:-translate-y-0.5",
      },
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  asChild = false,
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={cn(buttonVariants({ className, size, variant }))} {...props} />
  );
}

export { Button, buttonVariants };
