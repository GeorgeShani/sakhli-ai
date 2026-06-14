import { type ReactNode, useEffect, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Radio,
  Users,
  Sparkles,
  Home,
  LogOut,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useAgentFeed } from "@/lib/agent-events";

export type HostSection = "overview" | "calendar" | "channels" | "applicants" | "operations";

const NAV: { section: HostSection; labelKey: string; Icon: typeof Home }[] = [
  { section: "overview", labelKey: "host.nav.overview", Icon: LayoutDashboard },
  { section: "calendar", labelKey: "host.nav.calendar", Icon: CalendarDays },
  { section: "channels", labelKey: "host.nav.channels", Icon: Radio },
  { section: "applicants", labelKey: "host.nav.applicants", Icon: Users },
  { section: "operations", labelKey: "host.nav.operations", Icon: Sparkles },
];

/** A live "Connected to n8n · last sync 12s ago" indicator driven by the agent feed. */
function N8nBadge() {
  const { t, locale } = useI18n();
  const { latest } = useAgentFeed(locale, { persona: "host", intervalMs: 8000, seed: 1, max: 1 });
  const [lastSync, setLastSync] = useState<number>(() => Date.now());
  const [, force] = useState(0);

  useEffect(() => {
    if (latest) setLastSync(latest.at);
  }, [latest]);

  // tick so the relative time stays fresh
  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  const secs = Math.max(1, Math.round((Date.now() - lastSync) / 1000));
  return (
    <div className="hidden items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs sm:flex">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <Zap className="h-3 w-3 text-emerald-500" />
      <span className="font-medium text-emerald-700 dark:text-emerald-300">{t("host.n8n.connected")}</span>
      <span className="text-muted-foreground">· {t("host.n8n.lastsync")} {secs}s</span>
    </div>
  );
}

/** Dashboard shell for hosts: top bar + left sidebar (sections via ?section=). */
export function HostShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const section = useRouterState({
    select: (s) => (s.location.search as { section?: HostSection }).section ?? "overview",
  });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/host" className="flex items-center gap-2 font-syne text-lg md:text-xl font-semibold tracking-tight">
            {t("app.name")}
            <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Host
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <N8nBadge />
            <ThemeToggle />
            <LanguageToggle />
            {user && (
              <Button size="icon" variant="ghost" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-0 md:gap-6 md:px-4">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-border py-6 md:block">
          <nav className="space-y-1 pr-3">
            {NAV.map((n) => {
              const active = section === n.section;
              return (
                <Link
                  key={n.section}
                  to="/host"
                  search={n.section === "overview" ? {} : { section: n.section }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <n.Icon className="h-4 w-4" />
                  {t(n.labelKey)}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-0">
          {/* Mobile section nav */}
          <nav className="mb-4 flex gap-1 overflow-x-auto pb-1 md:hidden">
            {NAV.map((n) => {
              const active = section === n.section;
              return (
                <Link
                  key={n.section}
                  to="/host"
                  search={n.section === "overview" ? {} : { section: n.section }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <n.Icon className="h-3.5 w-3.5" />
                  {t(n.labelKey)}
                </Link>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}
