"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function EmailRequestForm() { const [pending, setPending] = useState(false); async function submit(form: FormData) { setPending(true); const response = await fetch("/api/auth/forgot-password", { body: JSON.stringify({ email: form.get("email") }), headers: { "Content-Type": "application/json" }, method: "POST" }); setPending(false); if (!response.ok) { toast.error("Unable to request a reset email."); return; } toast.success("If that account exists, a reset link has been sent."); } return <form action={submit} className="mt-6 space-y-4"><Input name="email" placeholder="Campus email" required type="email" /><Button className="w-full" disabled={pending} type="submit">{pending ? "Sending..." : "Send reset link"}</Button></form>; }
