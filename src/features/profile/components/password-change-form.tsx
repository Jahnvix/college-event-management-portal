"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        body: JSON.stringify({ currentPassword, nextPassword }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error?.message ?? "Unable to update your password.");
      }

      setCurrentPassword("");
      setNextPassword("");
      toast.success("Password updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update your password.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="current-password">Current password</Label>
        <Input
          id="current-password"
          placeholder="Enter your current password"
          type="password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          placeholder="Use 8+ chars with upper, lower, and number"
          type="password"
          value={nextPassword}
          onChange={(event) => setNextPassword(event.target.value)}
        />
      </div>
      <Button
        disabled={saving || !currentPassword || nextPassword.length < 8}
        onClick={() => void submit()}
      >
        {saving ? "Updating..." : "Change password"}
      </Button>
    </div>
  );
}
