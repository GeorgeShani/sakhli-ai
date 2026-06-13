import { Link, useRouterState } from "@tanstack/react-router";
import { Home } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItem = (to: string, label: string) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={[
          "px-3 py-1.5 rounded-md text-sm transition-colors",
          active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-4 w-4" />
          </span>
          {t("app.name")}
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItem("/", t("nav.home"))}
          {navItem("/matches", t("nav.matches"))}
          {navItem("/dashboard", t("nav.dashboard"))}
          {navItem("/host", "Host")}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/onboarding">{t("nav.start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
