import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";
export function AuthShell({ children, title }: Readonly<{ children: React.ReactNode; title: string }>) { return <main className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6"><div className="flex items-center justify-between"><Link className="font-display text-xl font-bold" href={ROUTES.home}>{siteConfig.name}</Link><ThemeToggle /></div><section className="glass-panel my-auto rounded-3xl border border-border p-7"><h1 className="font-display text-3xl font-bold">{title}</h1>{children}</section></main>; }
