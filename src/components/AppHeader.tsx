import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Home, LogOut, User as UserIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "./LanguageToggle";
import { Button } from "@/components/ui/button";
import { useAuth, type AppRole } from "@/lib/auth";

const ROLE_HOME: Record<AppRole, string> = {
  student: "/matches",
  host: "/host",
  cleaner: "/cleaner",
  parent: "/parent",
};

export function AppHeader() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
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
          {(!profile?.role || profile.role === "student") && navItem("/matches", t("nav.matches"))}
          {(!profile?.role || profile.role === "student") && navItem("/dashboard", t("nav.dashboard"))}
          {(!profile?.role || profile.role === "host") && navItem("/host", "Host")}
          {profile?.role === "cleaner" && navItem("/cleaner", "Cleaner")}
          {profile?.role === "parent" && navItem("/parent", "Parent")}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          {user ? (
            <>
              {profile?.role && (
                <Button asChild size="sm" variant="ghost" className="hidden sm:inline-flex">
                  <Link to={ROLE_HOME[profile.role]}>
                    <UserIcon className="mr-1 h-3.5 w-3.5" />
                    {profile.role}
                  </Link>
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-1 h-3.5 w-3.5" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link to="/role-select">{t("nav.start")}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
