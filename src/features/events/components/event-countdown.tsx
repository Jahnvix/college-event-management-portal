"use client";

import { useEffect, useState } from "react";

function remaining(startAt: string) { const milliseconds = new Date(startAt).getTime() - Date.now(); if (milliseconds <= 0) return "In progress or complete"; const hours = Math.floor(milliseconds / 3_600_000); const days = Math.floor(hours / 24); return `${days}d ${hours % 24}h remaining`; }

export function EventCountdown({ startAt }: Readonly<{ startAt: string }>) { const [value, setValue] = useState(() => remaining(startAt)); useEffect(() => { const timer = window.setInterval(() => setValue(remaining(startAt)), 60_000); return () => window.clearInterval(timer); }, [startAt]); return <p aria-live="polite" className="text-xs font-bold text-accent">{value}</p>; }
