import Link from "next/link";
import type { Route } from "next";
import { CalendarDays, Clock3, Heart, Megaphone, TicketCheck } from "lucide-react";

import { DashboardShell } from "@/components/layouts/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getCurrentUser } from "@/server/auth";
import { getStudentDashboard } from "@/server/dashboard/student-dashboard";

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user?.id) return null;

  const dashboard = await getStudentDashboard(user.id);
  const statCards = [
    { icon: TicketCheck, label: "Registrations", value: dashboard.registrations.length },
    { icon: CalendarDays, label: "Discoverable events", value: dashboard.upcomingEvents.length },
    { icon: Heart, label: "Saved events", value: dashboard.bookmarks },
  ];

  return <DashboardShell><div className="space-y-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Student space</p><h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Good to see you, {user.name?.split(" ")[0] ?? "there"}.</h1><p className="mt-2 text-sm text-muted">Your campus week, organized in one place.</p></div><Button asChild><Link href={ROUTES.events as Route}>Explore events</Link></Button></header>
    <section className="grid gap-4 sm:grid-cols-3">{statCards.map(({ icon: Icon, label, value }) => <Card key={label}><CardContent className="flex items-center gap-4 p-5"><div className="rounded-2xl bg-secondary p-3 text-primary"><Icon className="size-5" /></div><div><p className="font-display text-2xl font-bold">{value}</p><p className="text-xs text-muted">{label}</p></div></CardContent></Card>)}</section>
    <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]"><Card><CardHeader><CardTitle>Upcoming for you</CardTitle><CardDescription>Registrations that deserve a place on your calendar.</CardDescription></CardHeader><CardContent className="space-y-3">{dashboard.registrations.length ? dashboard.registrations.map((registration) => <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4" key={registration.id}><div><p className="font-bold">{registration.event.title}</p><p className="mt-1 text-xs text-muted">{dateTimeFormatter.format(registration.event.startAt)} · {registration.event.venueName}</p></div><Badge variant={registration.status === "APPROVED" ? "success" : "warning"}>{registration.status.toLowerCase()}</Badge></div>) : <EmptyState icon={CalendarDays} text="No registrations yet. Explore what is happening around campus." />}</CardContent></Card><Card><CardHeader><CardTitle>Announcements</CardTitle><CardDescription>Important signals from your campus.</CardDescription></CardHeader><CardContent className="space-y-4">{dashboard.announcements.length ? dashboard.announcements.map((announcement) => <article className="border-l-2 border-accent pl-4" key={announcement.id}><p className="text-sm font-bold">{announcement.title}</p><p className="mt-1 line-clamp-2 text-sm leading-6 text-muted">{announcement.summary}</p><p className="mt-2 text-xs text-muted">By {announcement.author.name}</p></article>) : <EmptyState icon={Megaphone} text="New campus announcements will appear here." />}</CardContent></Card></section>
    <section><div className="mb-4 flex items-center justify-between"><div><h2 className="font-display text-2xl font-bold">Worth a look</h2><p className="mt-1 text-sm text-muted">Freshly published events around campus.</p></div><Button asChild size="sm" variant="ghost"><Link href={ROUTES.events as Route}>Browse all</Link></Button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{dashboard.upcomingEvents.length ? dashboard.upcomingEvents.map((event) => <Card key={event.id}><CardContent className="p-5"><Badge variant="secondary">{event.category.toLowerCase()}</Badge><h3 className="mt-5 font-display text-xl font-bold">{event.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{event.shortDescription}</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-primary"><Clock3 className="size-4" />{dateTimeFormatter.format(event.startAt)}</div></CardContent></Card>) : <Card className="md:col-span-2 xl:col-span-3"><CardContent className="p-5"><EmptyState icon={CalendarDays} text="Published events will appear here as soon as organizers share them." /></CardContent></Card>}</div></section>
  </div></DashboardShell>;
}

function EmptyState({ icon: Icon, text }: Readonly<{ icon: typeof CalendarDays; text: string }>) { return <div className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-5 text-center text-sm text-muted"><Icon className="size-5 text-primary" />{text}</div>; }
