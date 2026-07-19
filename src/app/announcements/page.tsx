import { AnnouncementStatus } from "@prisma/client";

import { AppFooter } from "@/components/layouts/app-footer";
import { AppHeader } from "@/components/layouts/app-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/server/database";

export default async function AnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({ include: { author: { select: { name: true } } }, orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }], where: { status: AnnouncementStatus.PUBLISHED } });
  return <><AppHeader /><main className="mx-auto min-h-[70vh] max-w-5xl px-5 py-14 sm:px-8"><p className="text-xs font-bold tracking-[0.2em] text-accent uppercase">Campus news</p><h1 className="mt-2 font-display text-4xl font-bold">Announcements</h1><div className="mt-10 space-y-4">{announcements.length ? announcements.map((item) => <Card key={item.id}><CardContent className="p-6">{item.isPinned ? <Badge variant="warning">Pinned</Badge> : null}<h2 className="mt-3 font-display text-2xl font-bold">{item.title}</h2><p className="mt-3 text-sm leading-7 text-muted">{item.summary}</p><p className="mt-4 text-xs font-bold text-primary">By {item.author.name}</p></CardContent></Card>) : <Card><CardContent className="p-10 text-center text-sm text-muted">No announcements have been published.</CardContent></Card>}</div></main><AppFooter /></>;
}
