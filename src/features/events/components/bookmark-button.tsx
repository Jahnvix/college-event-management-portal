"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export function BookmarkButton({ eventId }: Readonly<{ eventId: string }>) {
  const [saved, setSaved] = useState(false);
  async function toggle() { const response = await fetch(`/api/events/${eventId}/bookmark`, { method: saved ? "DELETE" : "POST" }); if (!response.ok) { toast.error("Unable to update bookmark."); return; } setSaved(!saved); toast.success(saved ? "Removed from saved events." : "Saved for later."); }
  return <Button aria-label="Save event" size="icon" variant="outline" onClick={toggle}><Heart className={saved ? "size-4 fill-accent text-accent" : "size-4"} /></Button>;
}
