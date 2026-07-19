"use client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export function ShareButton({ title }: Readonly<{ title: string }>) { async function share() { const url = window.location.href; if (navigator.share) { await navigator.share({ title, url }); return; } await navigator.clipboard.writeText(url); toast.success("Event link copied."); } return <Button aria-label="Share event" size="icon" variant="outline" onClick={() => void share()}><Share2 className="size-4" /></Button>; }
