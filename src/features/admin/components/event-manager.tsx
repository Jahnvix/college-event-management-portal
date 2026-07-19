"use client";

import { EventStatus } from "@prisma/client";
import { CalendarDays, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { AnnouncementManager } from "./announcement-manager";

type EventItem = {
  approvedRegistrationsCount: number;
  capacity: number;
  id: string;
  isFeatured: boolean;
  registrationClosesAt: string;
  requiresApproval: boolean;
  shortDescription: string;
  startAt: string;
  status: EventStatus;
  title: string;
  venueName: string;
};

type EventListResponse = { data: EventItem[] };

const selectClassName =
  "h-11 rounded-xl border border-border bg-background-elevated px-3 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring";

export function EventManager() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [form, setForm] = useState(() => {
    const tomorrow = new Date(Date.now() + 86_400_000);
    const closeAt = new Date(Date.now() + 43_200_000);

    return {
      capacity: "80",
      registrationClosesAt: closeAt.toISOString().slice(0, 16),
      shortDescription: "Campus event draft awaiting agenda, speakers, and promotion details.",
      startAt: tomorrow.toISOString().slice(0, 16),
      title: "",
      venueName: "Main Campus",
    };
  });

  async function refreshEvents() {
    setError(null);
    const response = await fetch("/api/admin/events");

    if (!response.ok) {
      setError("Unable to load events.");
      return;
    }

    const payload = (await response.json()) as EventListResponse;
    setEvents(payload.data);
  }

  useEffect(() => {
    void refreshEvents();
  }, []);

  async function createDraft() {
    const startAt = new Date(form.startAt);
    const registrationClosesAt = new Date(form.registrationClosesAt);
    const endAt = new Date(startAt.getTime() + 2 * 60 * 60 * 1000);
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/events", {
        body: JSON.stringify({
          capacity: Number(form.capacity),
          category: "OTHER",
          description: `${form.shortDescription}\n\nAdd your final agenda, speakers, eligibility, and check-in notes before publishing this event.`,
          endAt,
          isFeatured: false,
          registrationClosesAt,
          requiresApproval: false,
          shortDescription: form.shortDescription,
          startAt,
          title: form.title,
          venueAddress: form.venueName,
          venueCity: "Campus",
          venueName: form.venueName,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to create the draft event.");
      }

      setForm((current) => ({ ...current, title: "" }));
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

  async function updateEvent(
    eventId: string,
    data: Partial<Pick<EventItem, "isFeatured" | "requiresApproval" | "status">>,
  ) {
    setPendingEventId(eventId);
    setError(null);

    try {
      const response = await fetch(`/api/admin/events/${eventId}`, {
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Unable to update the event.");
      }

      await refreshEvents();
      toast.success("Event updated.");
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to update the event.";
      setError(message);
      toast.error(message);
    } finally {
      setPendingEventId(null);
    }
  }

  const eventSummary = useMemo(
    () => ({
      drafts: events.filter((event) => event.status === EventStatus.DRAFT).length,
      featured: events.filter((event) => event.isFeatured).length,
      published: events.filter((event) => event.status === EventStatus.PUBLISHED).length,
      total: events.length,
    }),
    [events],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle>Event management</CardTitle>
            <p className="mt-1 text-sm text-muted">
              Create, publish, feature, and keep registrations healthy from one place.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-border px-4 py-3">
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Total</p>
              <p className="mt-1 font-display text-2xl font-bold">{eventSummary.total}</p>
            </div>
            <div className="rounded-2xl border border-border px-4 py-3">
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Drafts</p>
              <p className="mt-1 font-display text-2xl font-bold">{eventSummary.drafts}</p>
            </div>
            <div className="rounded-2xl border border-border px-4 py-3">
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Published</p>
              <p className="mt-1 font-display text-2xl font-bold">{eventSummary.published}</p>
            </div>
            <div className="rounded-2xl border border-border px-4 py-3">
              <p className="text-xs font-bold tracking-[0.12em] text-muted uppercase">Featured</p>
              <p className="mt-1 font-display text-2xl font-bold">{eventSummary.featured}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-4 rounded-3xl border border-border p-5">
            <div>
              <p className="font-bold">New draft</p>
              <p className="mt-1 text-sm text-muted">Start with the core event details and refine the rest later.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="event-title">Event title</Label>
                <Input
                  id="event-title"
                  disabled={isCreating}
                  placeholder="AI Career Sprint"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="event-summary">Short description</Label>
                <Textarea
                  id="event-summary"
                  className="min-h-24"
                  disabled={isCreating}
                  placeholder="A concise, student-facing summary of the event."
                  value={form.shortDescription}
                  onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="event-venue">Venue</Label>
                <Input
                  id="event-venue"
                  disabled={isCreating}
                  value={form.venueName}
                  onChange={(event) => setForm((current) => ({ ...current, venueName: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="event-capacity">Capacity</Label>
                <Input
                  id="event-capacity"
                  disabled={isCreating}
                  min="1"
                  type="number"
                  value={form.capacity}
                  onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="event-start">Starts at</Label>
                <Input
                  id="event-start"
                  disabled={isCreating}
                  type="datetime-local"
                  value={form.startAt}
                  onChange={(event) => setForm((current) => ({ ...current, startAt: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="event-close">Registration closes</Label>
                <Input
                  id="event-close"
                  disabled={isCreating}
                  type="datetime-local"
                  value={form.registrationClosesAt}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, registrationClosesAt: event.target.value }))
                  }
                />
              </div>
            </div>
            {error ? <p className="text-sm text-red-600 dark:text-red-300">{error}</p> : null}
            <Button
              className="w-full"
              disabled={
                isCreating ||
                form.title.trim().length < 3 ||
                form.shortDescription.trim().length < 10 ||
                Number(form.capacity) < 1
              }
              onClick={createDraft}
            >
              {isCreating ? "Creating..." : "Create draft event"}
            </Button>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Live queue</p>
                <p className="text-sm text-muted">Recent events with quick publishing controls.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => void refreshEvents()}>
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              {events.length ? (
                events.slice(0, 8).map((event) => {
                  const seatsRemaining = Math.max(0, event.capacity - event.approvedRegistrationsCount);

                  return (
                    <article className="rounded-3xl border border-border p-4" key={event.id}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-bold">{event.title}</p>
                            <Badge variant={event.status === EventStatus.PUBLISHED ? "success" : "secondary"}>
                              {event.status.toLowerCase()}
                            </Badge>
                            {event.isFeatured ? <Badge variant="warning">Featured</Badge> : null}
                            {event.requiresApproval ? <Badge variant="outline">Approval required</Badge> : null}
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{event.shortDescription}</p>
                          <div className="mt-3 flex flex-wrap gap-4 text-xs font-bold text-muted">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-4 text-primary" />
                              {new Date(event.startAt).toLocaleString("en-IN", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                            <span>{event.venueName}</span>
                            <span>{seatsRemaining} seats left</span>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <select
                            aria-label={`Status for ${event.title}`}
                            className={selectClassName}
                            disabled={pendingEventId === event.id}
                            value={event.status}
                            onChange={(currentEvent) =>
                              void updateEvent(event.id, {
                                status: currentEvent.target.value as EventStatus,
                              })
                            }
                          >
                            {Object.values(EventStatus).map((status) => (
                              <option key={status} value={status}>
                                {status.toLowerCase()}
                              </option>
                            ))}
                          </select>
                          <Button
                            disabled={pendingEventId === event.id}
                            size="sm"
                            variant={event.isFeatured ? "secondary" : "outline"}
                            onClick={() => void updateEvent(event.id, { isFeatured: !event.isFeatured })}
                          >
                            <Sparkles className="size-4" />
                            {event.isFeatured ? "Featured" : "Feature"}
                          </Button>
                          <Button
                            disabled={pendingEventId === event.id}
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              void updateEvent(event.id, {
                                requiresApproval: !event.requiresApproval,
                              })
                            }
                          >
                            {event.requiresApproval ? "Manual review" : "Auto approve"}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted">
                  Event drafts and published entries will appear here.
                </div>
              )}
            </div>
          </section>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        <AnnouncementManager />
      </div>
    </div>
  );
}
