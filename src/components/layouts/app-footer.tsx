import Link from "next/link";

import { siteConfig } from "@/config/site";
import { ROUTES } from "@/constants/routes";

export function AppFooter() {
  return (
    <footer className="border-t border-border px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <Link className="font-display font-bold text-foreground" href={ROUTES.home}>
          {siteConfig.name}
        </Link>
        <p>Built for campus communities that move together.</p>
      </div>
    </footer>
  );
}
