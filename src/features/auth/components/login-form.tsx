"use client";

import Link from "next/link";
import type { Route } from "next";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";

export function LoginForm() {
  const [pending, setPending] = useState(false);

  async function submit(form: FormData) {
    setPending(true);
    const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false });
    setPending(false);
    if (result?.error) { toast.error("Invalid email, password, or account status."); return; }
    window.location.assign(ROUTES.dashboard);
  }

  return <form action={submit} className="mt-6 space-y-4"><Input name="email" placeholder="Campus email" required type="email" /><Input name="password" placeholder="Password" required type="password" /><Button className="w-full" disabled={pending} type="submit">{pending ? "Signing in..." : "Sign in"}</Button><div className="flex justify-between text-sm text-muted"><Link href={ROUTES.forgotPassword as Route}>Forgot password?</Link><Link href={ROUTES.register as Route}>Create account</Link></div></form>;
}
