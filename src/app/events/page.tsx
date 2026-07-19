import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { EventStatus } from "@prisma/client";

import { AppHeader } from "@/components/layouts/app-header";
import { AppFooter } from "@/components/layouts/app-footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventFilters } from "@/features/events/components/event-filters";
import { prisma } from "@/server/database";

const formatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function EventsPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    category?: string;
    q?: string;
    venue?: string;
    date?: string;
  }>;
}>) {
  const filters = await searchParams;

  const where: Record<string, unknown> = {
    status: EventStatus.PUBLISHED,
  };

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.venue) {
    where.venueCity = {
      contains: filters.venue,
      mode: "insensitive",
    };
  }

  if (filters.q) {
    where.OR = [
      {
        title: {
          contains: filters.q,
          mode: "insensitive",
        },
      },
      {
        shortDescription: {
          contains: filters.q,
          mode: "insensitive",
        },
      },
    ];
  }

  if (filters.date) {
    const start = new Date(filters.date);
    const end = new Date(filters.date);

    end.setDate(end.getDate() + 1);

    where.startAt = {
      gte: start,
      lt: end,
    };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: [
      { isFeatured: "desc" },
      { startAt: "asc" },
    ],
  });

  return (
    <>
      <AppHeader />

      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-14 sm:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Discover
        </p>

        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
          The campus calendar.
        </h1>

        <p className="mt-4 max-w-2xl text-muted">
          Browse upcoming events, save the ones that catch your eye, and
          register before the room fills up.
        </p>

        <EventFilters
          category={filters.category}
          q={filters.q}
          venue={filters.venue}
          date={filters.date}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {events.length ? (
            events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}` as Route}
                className="group"
              >
                <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Badge variant="secondary">
                      {event.category.toLowerCase()}
                    </Badge>

                    <h2 className="mt-6 font-display text-2xl font-bold">
                      {event.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                      {event.shortDescription}
                    </p>

                    <div className="mt-6 space-y-2 text-xs font-bold text-muted">
                      <p className="flex gap-2">
                        <CalendarDays className="size-4 text-primary" />
                        {formatter.format(event.startAt)}
                      </p>

                      <p className="flex gap-2">
                        <MapPin className="size-4 text-primary" />
                        {event.venueName}
                      </p>

                      <p className="flex gap-2">
                        <Users className="size-4 text-primary" />
                        {Math.max(
                          0,
                          event.capacity -
                            event.approvedRegistrationsCount
                        )}{" "}
                        seats remaining
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="md:col-span-2 lg:col-span-3">
              <CardContent className="p-10 text-center text-sm text-muted">
                No events match these filters.
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <AppFooter />
    </>
  );
}