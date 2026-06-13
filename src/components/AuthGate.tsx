import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

type Props = {
  children: ReactNode;
  /** If true and user has no role yet, show role-select CTA overlay. Default: true */
  requireRole?: boolean;
};

export function AuthGate({ children, requireRole = true }: Props) {
  const { loading, user, profile } = useAuth();

  if (loading) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-40 blur-sm">{children}</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <div
          aria-hidden
          className="pointer-events-none select-none opacity-30 blur-md saturate-150"
        >
          {children}
        </div>
        <div className="absolute inset-0 flex items-start justify-center overflow-y-auto bg-background/40 px-4 py-10 backdrop-blur-xl">
          <AuthCard />
        </div>
      </div>
    );
  }

  if (requireRole && !profile?.role) {
    return (
      <div className="relative min-h-[calc(100vh-3.5rem)]">
        <div
          aria-hidden
          className="pointer-events-none select-none opacity-30 blur-md saturate-150"
        >
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 px-4 backdrop-blur-xl">
          <div className="card-elevated max-w-md p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">
              აირჩიეთ თქვენი როლი
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose Your Profile Purpose to continue.
            </p>
            <Button asChild className="mt-5 w-full">
              <Link to="/role-select">Choose role</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AuthCard() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, name || undefined);
    setBusy(false);
    if (res.error) setError(res.error);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Cyber halo */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
            ავტორიზაცია / Access Restricted
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            გთხოვთ გაიაროთ ავტორიზაცია ფუნქციონალის სრულად გამოსაყენებლად
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please log in to unlock SakhliAI matching and property automation.
          </p>
        </div>

        <div className="p-6">
          <div className="mb-4 flex rounded-md border border-border bg-secondary p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signin" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signup" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="auth-name">Full name</Label>
                <Input
                  id="auth-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nino Beridze"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="auth-password">Password</Label>
              <Input
                id="auth-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            {error && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" disabled={busy} className="w-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-secondary/60 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Sessions are end-to-end encrypted. We never share your data with hosts.
          </div>
        </div>
      </div>
    </div>
  );
}
