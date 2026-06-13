import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useProfile } from "@/lib/student-store";
import { LogOut, Mail, Moon, ShieldCheck, Sun, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SakhliAI" },
      { name: "description", content: "Manage your account, verification, and preferences." },
    ],
  }),
  component: () => (
    <AuthGate>
      <SettingsPage />
    </AuthGate>
  ),
});

function SettingsPage() {
  const { user, profile: authProfile, signOut } = useAuth();
  const { profile } = useProfile();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">
          მომხმარებლის პარამეტრები
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">User Settings</p>

        <div className="card-elevated mt-6 flex items-center gap-4 p-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
            <UserIcon className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-display text-lg font-semibold">
              {profile?.name || authProfile?.full_name || "Student"}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
          {profile?.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.4)] dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Not verified
            </span>
          )}
        </div>

        <div className="card-elevated mt-4 p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Appearance
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Light / Dark mode</div>
              <div className="text-xs text-muted-foreground">
                Current: {theme === "dark" ? "Dark" : "Light"}
              </div>
            </div>
            <Button variant="outline" onClick={toggle}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Toggle theme
            </Button>
          </div>
        </div>

        <div className="card-elevated mt-4 p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Student verification
          </div>
          <div className="mt-2 text-sm">
            {profile?.verified
              ? "Your academic email has been confirmed. You can access all matching features."
              : "Complete your academic email verification during onboarding to unlock all features."}
          </div>
          {profile?.university && (
            <div className="mt-2 text-sm text-muted-foreground">
              University: <span className="text-foreground">{profile.university}</span>
            </div>
          )}
        </div>

        <Button
          variant="destructive"
          className="mt-6 w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
