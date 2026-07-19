import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, Heart } from "lucide-react";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUser } from "@/server/auth";
import { prisma } from "@/server/database";

export default async function SavedEventsPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  const bookmarks = await prisma.bookmark.findMany({ include: { event: true }, orderBy: { createdAt: "desc" }, where: { userId: user.id } });
  return <DashboardShell><div className="space-y-7"><header><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Your collection</p><h1 className="mt-2 font-display text-3xl font-bold">Saved events</h1></header><div className="grid gap-4 md:grid-cols-2">{bookmarks.length ? bookmarks.map(({ event }) => <Link href={`/events/${event.slug}` as Route} key={event.id}><Card className="h-full transition-transform hover:-translate-y-1"><CardContent className="p-6"><Heart className="size-5 text-accent" /><h2 className="mt-5 font-display text-xl font-bold">{event.title}</h2><p className="mt-2 text-sm text-muted">{event.venueName}</p></CardContent></Card></Link>) : <Card className="md:col-span-2"><CardContent className="flex min-h-44 flex-col items-center justify-center gap-3 text-center text-sm text-muted"><CalendarDays className="size-6 text-primary" />Bookmark events to build your personal campus calendar.</CardContent></Card>}</div></div></DashboardShell>;
}
