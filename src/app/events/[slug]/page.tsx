import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { EventStatus } from "@prisma/client";

import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RegistrationButton } from "@/features/events/components/registration-button";
import { BookmarkButton } from "@/features/events/components/bookmark-button";
import { EventCountdown } from "@/features/events/components/event-countdown";
import { ShareButton } from "@/features/events/components/share-button";
import { prisma } from "@/server/database";

const formatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "full", timeStyle: "short" });

export default async function EventDetailPage({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
  const event = await prisma.event.findFirst({ where: { slug: (await params).slug, status: EventStatus.PUBLISHED } });
  if (!event) notFound();
  const remainingSeats = Math.max(0, event.capacity - event.approvedRegistrationsCount);
  return <><AppHeader /><main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-14 sm:px-8"><Badge variant="secondary">{event.category.toLowerCase()}</Badge><h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight sm:text-6xl">{event.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{event.shortDescription}</p><div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]"><article className="rounded-3xl border border-border bg-background-elevated p-7"><h2 className="font-display text-2xl font-bold">About this event</h2><p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">{event.description}</p></article><Card><CardContent className="space-y-5 p-6"><div className="space-y-3 text-sm"><p className="flex gap-3"><CalendarDays className="size-5 text-primary" />{formatter.format(event.startAt)}</p><p className="flex gap-3"><MapPin className="size-5 text-primary" />{event.venueName}, {event.venueCity}</p><p className="flex gap-3"><Users className="size-5 text-primary" />{remainingSeats} seats remaining</p></div><EventCountdown startAt={event.startAt.toISOString()} /><div className="flex gap-3"><RegistrationButton eventId={event.id} /><BookmarkButton eventId={event.id} /><ShareButton title={event.title} /></div></CardContent></Card></div></main><AppFooter /></>;
}
