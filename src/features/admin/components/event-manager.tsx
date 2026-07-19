"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { AnnouncementManager } from "./announcement-manager";

type EventListResponse = { data: unknown[] };

export function EventManager() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");

  async function refreshEvents() {
    setError(null);
    const response = await fetch("/api/admin/events");

    if (!response.ok) {
      setError("Unable to load events.");
      return;
    }

    const payload = (await response.json()) as EventListResponse;
    setCount(payload.data.length);
  }

  useEffect(() => {
    void refreshEvents();
  }, []);

  async function createDraft() {
    const now = new Date();
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/events", {
        body: JSON.stringify({
          capacity: 50,
          category: "OTHER",
          description: "Complete this event description before publishing the event.",
          endAt: new Date(now.getTime() + 90_000_000),
          registrationClosesAt: new Date(now.getTime() + 82_800_000),
          shortDescription: "Campus event draft awaiting details.",
          startAt: new Date(now.getTime() + 86_400_000),
          title,
          venueAddress: "Campus",
          venueCity: "Campus",
          venueName: "Campus",
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) throw new Error("Unable to create the draft event.");

      setTitle("");
      await refreshEvents();
      toast.success("Draft event created.");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to create the draft event.";
      setError(message);
      toast.error(message);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-2xl border border-border p-5">
        <p className="font-bold">Event management</p>
        <p className="mt-1 text-sm text-muted">
          {count === null ? "Loading events..." : `${count} events available to manage.`}
        </p>
        {error ? <p className="mt-2 text-sm text-red-600 dark:text-red-300">{error}</p> : null}
        <div className="mt-4 flex gap-2">
          <Input disabled={isCreating} placeholder="Draft event title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Button disabled={isCreating || title.trim().length < 3} size="sm" onClick={createDraft}>
            {isCreating ? "Creating..." : "Create draft"}
          </Button>
        </div>
      </section>
      <AnnouncementManager />
    </div>
  );
}
