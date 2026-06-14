import type { ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Compass, Heart, Wallet, User as UserIcon, LogOut, Crown } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useProfile } from "@/lib/student-store";
import { useSubscription } from "@/lib/subscription";
import { PLAN_DETAILS } from "@/lib/subscription";

type NavDest = {
  to: "/matches" | "/dashboard" | "/settings";
  search?: Record<string, string>;
  labelKey: string;
  Icon: typeof Compass;
  /** matcher: is this tab active for the current location? */
  match: (path: string, tab?: string) => boolean;
};

const NAV: NavDest[] = [
  { to: "/matches", labelKey: "nav.discover", Icon: Compass, match: (p) => p === "/matches" },
  { to: "/dashboard", labelKey: "nav.saved", Icon: Heart, match: (p, tab) => p === "/dashboard" && tab !== "utilities" },
  {
    to: "/dashboard",
    search: { tab: "utilities" },
    labelKey: "nav.utilities",
    Icon: Wallet,
    match: (p, tab) => p === "/dashboard" && tab === "utilities",
  },
  { to: "/settings", labelKey: "nav.profile", Icon: UserIcon, match: (p) => p === "/settings" },
];

/**
 * App-like shell for the student experience: a slim top bar plus a bottom
 * tab bar (full-width on mobile, a floating pill on desktop).
 */
export function StudentShell({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const tab = useRouterState({ select: (s) => (s.location.search as { tab?: string }).tab });
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { plan } = useSubscription();
  const navigate = useNavigate();
  const planName = locale === "ka" ? PLAN_DETAILS[plan].nameKa : PLAN_DETAILS[plan].name;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-28">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/matches" className="flex items-center gap-2 font-syne text-lg md:text-xl font-semibold tracking-tight">
            {t("app.name")}
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className={`hidden items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium sm:inline-flex ${
                plan === "free"
                  ? "border-border bg-secondary text-muted-foreground"
                  : "border-accent/40 bg-accent/10 text-accent-foreground"
              }`}
            >
              {plan !== "free" && <Crown className="h-3 w-3" />}
              {planName}
            </Link>
            <ThemeToggle />
            <LanguageToggle />
            {profile?.avatar && (
              <Link to="/settings" title={t("nav.profile")}>
                <img
                  src={profile.avatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-primary/40 object-cover"
                />
              </Link>
            )}
            {user && (
              <Button size="icon" variant="ghost" onClick={handleSignOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">{children}</main>

      {/* Bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur md:inset-x-auto md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:rounded-full md:border md:shadow-lg">
        <div className="mx-auto flex max-w-md items-center justify-around gap-1 px-2 py-2 md:gap-2 md:px-3">
          {NAV.map((n) => {
            const active = n.match(pathname, tab);
            return (
              <Link
                key={n.labelKey}
                to={n.to}
                search={n.search}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors md:flex-row md:gap-2 md:text-sm ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <n.Icon className="h-5 w-5 md:h-4 md:w-4" />
                <span>{t(n.labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
