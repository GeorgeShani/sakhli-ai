import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#how", key: "land.nav.how" },
  { href: "#features", key: "land.nav.features" },
  { href: "#automation", key: "land.nav.automation" },
  { href: "#hosts", key: "land.nav.hosts" },
] as const;

/** Public, logged-out header for the landing page only. */
export function MarketingHeader() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </span>
          {t("app.name")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(n.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/role-select">{t("nav.start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
