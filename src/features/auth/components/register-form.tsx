"use client";
import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
export function RegisterForm() { const [pending, setPending] = useState(false); async function submit(form: FormData) { setPending(true); const response = await fetch("/api/auth/register", { body: JSON.stringify({ email: form.get("email"), name: form.get("name"), password: form.get("password") }), headers: { "Content-Type": "application/json" }, method: "POST" }); setPending(false); if (!response.ok) { toast.error("Unable to create your account."); return; } toast.success("Account created. Check your email to verify it."); } return <form action={submit} className="mt-6 space-y-4"><Input name="name" placeholder="Full name" required /><Input name="email" placeholder="Campus email" required type="email" /><Input name="password" placeholder="Password" required type="password" /><Button className="w-full" disabled={pending} type="submit">{pending ? "Creating..." : "Create account"}</Button><p className="text-sm text-muted">Already have an account? <Link href={ROUTES.login as Route}>Sign in</Link></p></form>; }
