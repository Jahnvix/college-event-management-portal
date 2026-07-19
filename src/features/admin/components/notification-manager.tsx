"use client";

import { NotificationType } from "@prisma/client";
import { BellRing, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type NotificationItem = {
  createdAt: string;
  id: string;
  message: string;
  title: string;
  type: NotificationType;
  user: {
    email: string;
    name: string;
  };
};

type NotificationResponse = { data: NotificationItem[] };

const selectClassName =
  "h-11 rounded-xl border border-border bg-background-elevated px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring";

export function NotificationManager() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    actionUrl: "/dashboard",
    audience: "ACTIVE_STUDENTS",
    message: "",
    title: "",
    type: NotificationType.SYSTEM,
  });

  async function refreshNotifications() {
    const response = await fetch("/api/admin/notifications");

    if (!response.ok) {
      toast.error("Unable to load notifications.");
      return;
    }

    const payload = (await response.json()) as NotificationResponse;
    setItems(payload.data);
  }

  useEffect(() => {
    void refreshNotifications();
  }, []);

  async function sendNotification() {
    setSending(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        body: JSON.stringify({
          actionUrl: form.actionUrl || undefined,
          audience: form.audience,
          message: form.message,
          title: form.title,
          type: form.type,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to send notifications.");
      }

      setForm((current) => ({ ...current, message: "", title: "" }));
      await refreshNotifications();
      toast.success("Notifications sent.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to send notifications.");
    } finally {
      setSending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <p className="text-sm text-muted">Reach students quickly with in-app announcements and operational updates.</p>
      </CardHeader>
      <CardContent className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-4 rounded-3xl border border-border p-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="notification-title">Title</Label>
              <Input
                id="notification-title"
                placeholder="Schedule update"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="notification-message">Message</Label>
              <Textarea
                id="notification-message"
                className="min-h-28"
                placeholder="Explain the update clearly and tell recipients what to do next."
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="notification-audience">Audience</Label>
                <select
                  id="notification-audience"
                  className={selectClassName}
                  value={form.audience}
                  onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}
                >
                  <option value="ACTIVE_STUDENTS">Active students</option>
                  <option value="ADMINS">Admins</option>
                </select>
              </div>
              <div>
                <Label htmlFor="notification-type">Type</Label>
                <select
                  id="notification-type"
                  className={selectClassName}
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, type: event.target.value as NotificationType }))
                  }
                >
                  {Object.values(NotificationType).map((type) => (
                    <option key={type} value={type}>
                      {type.toLowerCase().replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="notification-link">Action link</Label>
              <Input
                id="notification-link"
                placeholder="/dashboard"
                value={form.actionUrl}
                onChange={(event) => setForm((current) => ({ ...current, actionUrl: event.target.value }))}
              />
            </div>
          </div>
          <Button
            className="w-full"
            disabled={sending || form.title.trim().length < 3 || form.message.trim().length < 10}
            onClick={() => void sendNotification()}
          >
            <Send className="size-4" />
            {sending ? "Sending..." : "Send notification"}
          </Button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <BellRing className="size-4 text-primary" />
            <p className="font-bold">Recent deliveries</p>
          </div>
          {items.length ? (
            items.map((item) => (
              <article className="rounded-3xl border border-border p-4" key={item.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{item.title}</p>
                      <Badge variant="secondary">{item.type.toLowerCase().replaceAll("_", " ")}</Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{item.message}</p>
                    <p className="mt-3 text-xs font-bold text-muted">
                      {item.user.name} · {item.user.email}
                    </p>
                  </div>
                  <p className="text-xs text-muted">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
              Sent notifications will appear here.
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
