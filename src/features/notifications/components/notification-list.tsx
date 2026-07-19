"use client";

import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Item = { id: string; message: string; readAt: string | null; title: string };
export function NotificationList({ initialNotifications }: Readonly<{ initialNotifications: Item[] }>) {
  const [items, setItems] = useState(initialNotifications); const [pending, setPending] = useState<string | null>(null);
  async function mutate(id: string, method: "DELETE" | "PATCH") { const previous = items; setPending(id); setItems((current) => method === "DELETE" ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item)); const response = await fetch(`/api/notifications/${id}/read`, { method }); if (!response.ok) { setItems(previous); toast.error("Unable to update notification."); } else toast.success(method === "DELETE" ? "Notification removed." : "Notification marked as read."); setPending(null); }
  async function markAllRead() { const previous = items; setPending("all"); setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() }))); const response = await fetch("/api/notifications/read-all", { method: "PATCH" }); if (!response.ok) { setItems(previous); toast.error("Unable to mark notifications as read."); } else toast.success("All notifications marked as read."); setPending(null); }
  return <div className="mt-8 space-y-3"><div className="flex justify-end"><Button disabled={pending !== null || !items.some((item) => !item.readAt)} size="sm" variant="outline" onClick={() => void markAllRead()}><CheckCheck className="size-4" />Mark all read</Button></div>{items.length ? items.map((item) => <Card key={item.id}><CardContent className="flex gap-4 p-5"><Bell className="mt-0.5 size-5 shrink-0 text-primary" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="font-bold">{item.title}</p>{!item.readAt ? <Badge variant="success">New</Badge> : null}</div><p className="mt-1 text-sm leading-6 text-muted">{item.message}</p></div><div className="flex gap-1">{!item.readAt ? <Button aria-label="Mark notification as read" disabled={pending === item.id} size="icon" variant="ghost" onClick={() => void mutate(item.id, "PATCH")}><CheckCheck className="size-4" /></Button> : null}<Button aria-label="Delete notification" disabled={pending === item.id} size="icon" variant="ghost" onClick={() => void mutate(item.id, "DELETE")}><Trash2 className="size-4" /></Button></div></CardContent></Card>) : <Card><CardContent className="p-10 text-center text-sm text-muted">You are all caught up.</CardContent></Card>}</div>;
}
