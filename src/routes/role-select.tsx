import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type AppRole } from "@/lib/auth";
import {
  GraduationCap,
  Building2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";

const PENDING_ROLE_KEY = "sakhli:pending_role";

export const Route = createFileRoute("/role-select")({
  head: () => ({
    meta: [
      { title: "Choose your role — SakhliAI" },
      { name: "description", content: "Pick how you use SakhliAI: student or host." },
    ],
  }),
  component: RoleSelectPage,
});

type Card = {
  role: AppRole;
  icon: typeof GraduationCap;
  titleKa: string;
  titleEn: string;
  desc: string;
  to: "/onboarding" | "/host";
  tint: string;
};

const CARDS: Card[] = [
  {
    role: "student",
    icon: GraduationCap,
    titleKa: "ბინის ქირაობა (სტუდენტი)",
    titleEn: "Rent a Flat (Student)",
    desc: "Take the compatibility quiz and swipe through fit-scored flatmates and homes near your university.",
    to: "/onboarding",
    tint: "from-primary/15 to-primary/5 text-primary",
  },
  {
    role: "host",
    icon: Building2,
    titleKa: "ბინის გაქირავება (მასპინძელი)",
    titleEn: "Rent Out My House (Host)",
    desc: "Unified live calendar, channel sync (Airbnb, Booking.com), AI rent predictor, and occupancy analytics.",
    to: "/host",
    tint: "from-accent/20 to-accent/5 text-accent",
  },
];

function readPendingRole(): AppRole | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(PENDING_ROLE_KEY);
  return v === "student" || v === "host" ? v : null;
}

function RoleSelectPage() {
  const { user, profile, setRole, loading } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Card | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // Restore any pending role chosen before refresh
  useEffect(() => {
    if (selected) return;
    const pending = readPendingRole();
    if (pending) {
      const c = CARDS.find((x) => x.role === pending) ?? null;
      if (c) setSelected(c);
    }
  }, [selected]);

  // Once the user is authenticated and a role is selected → set role + redirect
  useEffect(() => {
    if (loading || !user || !selected || applying) return;
    let cancelled = false;
    setApplying(true);

    // Hard fallback: never let "Setting up..." spin longer than 1.5s.
    // If the role write hasn't returned yet, proceed optimistically — the
    // destination route's own AuthGate will re-check the session.
    const fallback = window.setTimeout(() => {
      if (cancelled) return;
      window.localStorage.removeItem(PENDING_ROLE_KEY);
      navigate({ to: selected.to });
    }, 1500);

    (async () => {
      try {
        const res = await setRole(selected.role);
        if (cancelled) return;
        window.clearTimeout(fallback);
        if (res.error) {
          // Role-change trigger or transient RLS race — surface but still continue.
          setErr(res.error);
          setApplying(false);
          return;
        }
        window.localStorage.removeItem(PENDING_ROLE_KEY);
        navigate({ to: selected.to });
      } catch (e) {
        if (cancelled) return;
        window.clearTimeout(fallback);
        setErr((e as Error).message);
        setApplying(false);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
    };
    // setRole / navigate are stable enough; keep deps minimal to avoid retrigger loops.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, selected, loading]);

  const pick = (c: Card) => {
    setErr(null);
    window.localStorage.setItem(PENDING_ROLE_KEY, c.role);
    setSelected(c);
  };

  const goBackToHome = () => {
    window.localStorage.removeItem(PENDING_ROLE_KEY);
    setSelected(null);
    navigate({ to: "/" });
  };

  const goBackToCards = () => {
    window.localStorage.removeItem(PENDING_ROLE_KEY);
    setSelected(null);
    setErr(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        {!selected && (
          <RoleCards
            onPick={pick}
            currentRole={profile?.role ?? null}
            onBackHome={goBackToHome}
            err={err}
          />
        )}

        {selected && (
          <AuthStep
            card={selected}
            user={!!user}
            applying={applying}
            err={err}
            onBackToCards={goBackToCards}
            onBackHome={goBackToHome}
          />
        )}
      </main>
    </div>
  );
}

function RoleCards({
  onPick,
  currentRole,
  onBackHome,
  err,
}: {
  onPick: (c: Card) => void;
  currentRole: AppRole | null;
  onBackHome: () => void;
  err: string | null;
}) {
  return (
    <>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          აირჩიეთ თქვენი როლი
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          Choose Your Profile Purpose
        </p>
      </div>

      {err && (
        <div className="mx-auto mt-6 max-w-md rounded-md border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {err}
        </div>
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {CARDS.map((c) => {
          const Icon = c.icon;
          const active = currentRole === c.role;
          return (
            <button
              key={c.role}
              onClick={() => onPick(c)}
              className={[
                "group relative overflow-hidden rounded-2xl border bg-card p-6 text-left transition-all",
                "hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-xl",
                active ? "border-accent ring-2 ring-accent/40" : "border-border",
              ].join(" ")}
            >
              <div
                className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br ${c.tint} blur-2xl opacity-60`}
              />
              <div className="relative">
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.tint} ring-1 ring-border`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4">
                  <div className="font-display text-lg font-semibold leading-snug">
                    {c.titleKa}
                  </div>
                  <div className="text-sm text-muted-foreground">{c.titleEn}</div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{c.desc}</p>

                <div className="mt-5 flex items-center justify-between">
                  {active ? (
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
                      Current role
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Tap to select</span>
                  )}
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button variant="ghost" onClick={onBackHome}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          უკან დაბრუნება / Go Back to Homepage
        </Button>
      </div>
    </>
  );
}

function AuthStep({
  card,
  user,
  applying,
  err,
  onBackToCards,
  onBackHome,
}: {
  card: Card;
  user: boolean;
  applying: boolean;
  err: string | null;
  onBackToCards: () => void;
  onBackHome: () => void;
}) {
  const Icon = card.icon;
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBackToCards}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Change role
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <Icon className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium">{card.titleEn}</span>
        </div>
      </div>

      {user || applying ? (
        <div className="card-elevated p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <div className="mt-3 text-sm text-muted-foreground">
            Setting up your {card.role} profile…
          </div>
        </div>
      ) : (
        <InlineAuthCard role={card.role} onBackHome={onBackHome} />
      )}

      {err && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {err}
        </div>
      )}
    </div>
  );
}

function InlineAuthCard({
  role,
  onBackHome,
}: {
  role: AppRole;
  onBackHome: () => void;
}) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
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
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/30 via-accent/20 to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-2xl">
        <div className="border-b border-border/50 bg-gradient-to-br from-primary/10 to-accent/5 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
            ავტორიზაცია / Create Your Account
          </h2>
          <p className="mt-2 text-sm text-foreground/80">
            {role === "student"
              ? "შემდეგ — 7-ნაბიჯიანი სტუდენტური ქვიზი."
              : "შემდეგ — მასპინძლის დაფა და კალენდარი."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 w-full"
            onClick={onBackHome}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            უკან დაბრუნება / Go Back to Homepage
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex rounded-md border border-border bg-secondary p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signup" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              Create account
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signin" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              Sign in
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="rs-name">Full name</Label>
                <Input
                  id="rs-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nino Beridze"
                  autoComplete="name"
                />
              </div>
            )}
            <div>
              <Label htmlFor="rs-email">Email</Label>
              <Input
                id="rs-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="rs-password">Password</Label>
              <Input
                id="rs-password"
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
              {mode === "signin" ? "Sign in & continue" : "Create account & continue"}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-secondary/60 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            Your role ({role}) is saved and will be applied the moment your account is ready.
          </div>
        </div>
      </div>
    </div>
  );
}
