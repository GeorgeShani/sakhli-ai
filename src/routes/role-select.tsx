import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { useAuth, type AppRole } from "@/lib/auth";
import {
  GraduationCap,
  Building2,
  Loader2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/role-select")({
  head: () => ({
    meta: [
      { title: "Choose your role — SakhliAI" },
      { name: "description", content: "Pick how you use SakhliAI: student, host, cleaner, or parent." },
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
  to: string;
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

function RoleSelectPage() {
  return (
    <AuthGate requireRole={false}>
      <RoleSelectInner />
    </AuthGate>
  );
}

function RoleSelectInner() {
  const { profile, setRole } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<AppRole | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // If they already have a role, gently route them to their home
  useEffect(() => {
    // no auto-redirect — user can re-pick
  }, [profile]);

  const choose = async (c: Card) => {
    setErr(null);
    setBusy(c.role);
    const res = await setRole(c.role);
    setBusy(null);
    if (res.error) {
      setErr(res.error);
      return;
    }
    navigate({ to: c.to });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
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
            const active = profile?.role === c.role;
            return (
              <button
                key={c.role}
                onClick={() => choose(c)}
                disabled={busy !== null}
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
                    {busy === c.role ? (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {profile?.role && (
          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
              Skip — go home
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
