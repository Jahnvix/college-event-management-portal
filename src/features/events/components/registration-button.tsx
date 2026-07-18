"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function RegistrationButton({ eventId }: Readonly<{ eventId: string }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  async function register() {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/events/${eventId}/registration`, { method: "POST" });
      const payload = await response.json() as { error?: { message?: string }; ok: boolean };
      if (!response.ok) throw new Error(payload.error?.message ?? "Registration failed.");
      toast.success("Registration confirmed. Your dashboard has been updated.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Registration failed."); }
    finally { setIsSubmitting(false); }
  }
  return <Button disabled={isSubmitting} size="lg" onClick={register}>{isSubmitting ? "Registering..." : "Register now"}</Button>;
}
