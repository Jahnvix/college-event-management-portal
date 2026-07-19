"use client";

import { AnnouncementStatus } from "@prisma/client";
import { Pin } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Announcement = {
  id: string;
  isPinned: boolean;
  status: AnnouncementStatus;
  summary: string;
  title: string;
};

type AnnouncementResponse = { data: Announcement[] };

const selectClassName =
  "h-11 rounded-xl border border-border bg-background-elevated px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring";

export function AnnouncementManager() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    content: "Add the full announcement details, callouts, and any event-specific guidance here.",
    summary: "",
    title: "",
  });

  async function refreshAnnouncements() {
    const response = await fetch("/api/admin/announcements");

    if (!response.ok) {
      toast.error("Unable to load announcements.");
      return;
    }

    const payload = (await response.json()) as AnnouncementResponse;
    setItems(payload.data);
  }

  useEffect(() => {
    void refreshAnnouncements();
  }, []);

  async function createAnnouncement() {
    setCreating(true);

    try {
      const response = await fetch("/api/admin/announcements", {
        body: JSON.stringify({
          content: form.content,
          isPinned: false,
          scope: "GLOBAL",
          status: AnnouncementStatus.DRAFT,
          summary: form.summary,
          title: form.title,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to create the announcement.");
      }

      setForm((current) => ({ ...current, summary: "", title: "" }));
      await refreshAnnouncements();
      toast.success("Announcement draft created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create the announcement.");
    } finally {
      setCreating(false);
    }
  }

  async function updateAnnouncement(announcementId: string, data: Partial<Announcement>) {
    setPendingId(announcementId);

    try {
      const response = await fetch(`/api/admin/announcements/${announcementId}`, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to update the announcement.");
      }

      await refreshAnnouncements();
      toast.success("Announcement updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update the announcement.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcement management</CardTitle>
        <p className="text-sm text-muted">Draft news, publish urgent updates, and pin what matters most.</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="space-y-4 rounded-3xl border border-border p-5">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="announcement-title">Title</Label>
              <Input
                id="announcement-title"
                disabled={creating}
                placeholder="Hackathon registration closes tonight"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="announcement-summary">Summary</Label>
              <Textarea
                id="announcement-summary"
                className="min-h-24"
                disabled={creating}
                placeholder="Short summary shown on cards and dashboards."
                value={form.summary}
                onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
              />
            </div>
          </div>
          <Button
            className="w-full"
            disabled={creating || form.title.trim().length < 3 || form.summary.trim().length < 10}
            onClick={() => void createAnnouncement()}
          >
            {creating ? "Creating..." : "Create announcement draft"}
          </Button>
        </section>

        <div className="space-y-3">
          {items.length ? (
            items.slice(0, 6).map((item) => (
              <article className="rounded-3xl border border-border p-4" key={item.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold">{item.title}</p>
                      <Badge variant={item.status === AnnouncementStatus.PUBLISHED ? "success" : "secondary"}>
                        {item.status.toLowerCase()}
                      </Badge>
                      {item.isPinned ? (
                        <Badge variant="warning">
                          <Pin className="mr-1 size-3" />
                          Pinned
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{item.summary}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      aria-label={`Status for ${item.title}`}
                      className={selectClassName}
                      disabled={pendingId === item.id}
                      value={item.status}
                      onChange={(event) =>
                        void updateAnnouncement(item.id, {
                          status: event.target.value as AnnouncementStatus,
                        })
                      }
                    >
                      {Object.values(AnnouncementStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <Button
                      disabled={pendingId === item.id}
                      size="sm"
                      variant={item.isPinned ? "secondary" : "outline"}
                      onClick={() =>
                        void updateAnnouncement(item.id, {
                          isPinned: !item.isPinned,
                        })
                      }
                    >
                      <Pin className="size-4" />
                      {item.isPinned ? "Pinned" : "Pin"}
                    </Button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
              No announcements created yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
