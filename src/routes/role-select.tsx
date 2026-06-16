import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type AppRole } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
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
  validateSearch: (search: Record<string, unknown>): { role?: AppRole } => {
    const role = search.role;
    return { role: role === "student" || role === "host" ? role : undefined };
  },
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
  titleKey: string;
  descKey: string;
  nextKey: string;
  to: "/onboarding" | "/host";
  tint: string;
};

const CARDS: Card[] = [
  {
    role: "student",
    icon: GraduationCap,
    titleKey: "role.student.title",
    descKey: "role.student.desc",
    nextKey: "role.student.next",
    to: "/onboarding",
    tint: "from-primary/15 to-primary/5 text-primary",
  },
  {
    role: "host",
    icon: Building2,
    titleKey: "role.host.title",
    descKey: "role.host.desc",
    nextKey: "role.host.next",
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
  const { role: roleParam } = Route.useSearch();
  const [selected, setSelected] = useState<Card | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // Pre-select from a landing CTA (?role=student|host), then any pending role.
  useEffect(() => {
    if (selected) return;
    const target = roleParam ?? readPendingRole();
    if (target) {
      const c = CARDS.find((x) => x.role === target) ?? null;
      if (c) {
        if (typeof window !== "undefined") window.localStorage.setItem(PENDING_ROLE_KEY, c.role);
        setSelected(c);
      }
    }
  }, [selected, roleParam]);

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
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-background">
      <AppHeader />
      <main className="flex flex-1 items-center justify-center overflow-hidden px-4 py-6">
        <div className="w-full max-w-5xl">
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
        </div>
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
  const { t } = useI18n();
  return (
    <>
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          {t("role.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">{t("role.subtitle")}</p>
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
                <div
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${c.tint} ring-1 ring-border`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="mt-4">
                  <div className="font-display text-lg font-semibold leading-snug">
                    {t(c.titleKey)}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{t(c.descKey)}</p>

                <div className="mt-5 flex items-center justify-between">
                  {active ? (
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
                      {t("role.current")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t("role.tap")}</span>
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
          {t("auth.back")}
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
  const { t } = useI18n();
  const Icon = card.icon;
  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBackToCards}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {t("role.change")}
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs">
          <Icon className="h-3.5 w-3.5 text-accent" />
          <span className="font-medium">{t(card.titleKey)}</span>
        </div>
      </div>

      {user || applying ? (
        <div className="card-elevated p-8 text-center">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <div className="mt-3 text-sm text-muted-foreground">{t("role.setup")}</div>
        </div>
      ) : (
        <InlineAuthCard card={card} onBackHome={onBackHome} />
      )}

      {err && (
        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-center text-sm text-destructive">
          {err}
        </div>
      )}
    </div>
  );
}

function InlineAuthCard({ card, onBackHome }: { card: Card; onBackHome: () => void }) {
  const { signIn, signUp } = useAuth();
  const { t } = useI18n();
  const role = card.role;
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
    else if ("needsConfirmation" in res && res.needsConfirmation) {
      setError(
        "Account created, but email confirmation is required. Check your inbox, or disable “Confirm email” in Supabase → Authentication → Providers → Email.",
      );
      setMode("signin");
    }
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
            {t("role.account.title")}
          </h2>
          <p className="mt-2 text-sm text-foreground/80">{t(card.nextKey)}</p>
          <Button variant="outline" size="sm" className="mt-4 w-full" onClick={onBackHome}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            {t("auth.back")}
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-4 flex rounded-md border border-border bg-secondary p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signup" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              {t("auth.create")}
            </button>
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded px-3 py-1.5 transition ${mode === "signin" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              {t("auth.signin")}
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            {mode === "signup" && (
              <div>
                <Label htmlFor="rs-name">{t("auth.name")}</Label>
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
              <Label htmlFor="rs-email">{t("auth.email")}</Label>
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
              <Label htmlFor="rs-password">{t("auth.password")}</Label>
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
              {mode === "signin" ? t("role.signin.continue") : t("role.create.continue")}
            </Button>
          </form>

          <div className="mt-4 flex items-center gap-2 rounded-md bg-secondary/60 p-3 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
            {t("role.saved")}
          </div>
        </div>
      </div>
    </div>
  );
}
