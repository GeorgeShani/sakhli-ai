import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useMatches, useProfile, defaultProfile, type StudentProfile } from "@/lib/student-store";
import {
  flatmates,
  properties,
  fitScoreForFlatmate,
  fitScoreForProperty,
  type Flatmate,
  type Property,
  type FitScore,
} from "@/lib/mock-data";
import { Bed, MapPin, GraduationCap, BedDouble, Sparkles, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — SakhliAI" },
      { name: "description", content: "Swipe through compatible flatmates and homes." },
    ],
  }),
  component: MatchesPage,
});

type Tab = "people" | "places";

function MatchesPage() {
  const { t } = useI18n();
  const { profile, loaded } = useProfile();
  const { matches, record, reset } = useMatches();
  const [tab, setTab] = useState<Tab>("people");
  const [index, setIndex] = useState({ people: 0, places: 0 });

  const effectiveProfile: StudentProfile = profile ?? defaultProfile;

  const peopleStack = useMemo(
    () =>
      flatmates
        .map((f) => ({ f, fit: fitScoreForFlatmate(effectiveProfile, f) }))
        .sort((a, b) => b.fit.score - a.fit.score),
    [effectiveProfile],
  );
  const placeStack = useMemo(
    () =>
      properties
        .map((p) => ({ p, fit: fitScoreForProperty(effectiveProfile, p) }))
        .sort((a, b) => b.fit.score - a.fit.score),
    [effectiveProfile],
  );

  if (!loaded) return null;

  const handleSwipe = (liked: boolean) => {
    if (tab === "people") {
      const current = peopleStack[index.people];
      if (current) record("person", current.f.id, liked);
      setIndex((i) => ({ ...i, people: i.people + 1 }));
    } else {
      const current = placeStack[index.places];
      if (current) record("place", current.p.id, liked);
      setIndex((i) => ({ ...i, places: i.places + 1 }));
    }
  };

  const stackDone =
    (tab === "people" && index.people >= peopleStack.length) ||
    (tab === "places" && index.places >= placeStack.length);

  const tabBtn = (v: Tab, label: string) => (
    <button
      onClick={() => setTab(v)}
      className={[
        "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        tab === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="mx-auto max-w-xl px-4 py-8">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">{t("matches.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("matches.subtitle")}</p>
        </div>

        {!profile && (
          <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-3 text-center text-xs text-foreground">
            Browsing as guest.{" "}
            <Link to="/onboarding" className="font-semibold underline">Build your profile</Link>{" "}
            for personalized SakhliAI Fit Scores.
          </div>
        )}

        <div className="mt-6 flex rounded-lg border border-border bg-secondary p-1">
          {tabBtn("people", t("matches.tab.people"))}
          {tabBtn("places", t("matches.tab.places"))}
        </div>

        <div className="mt-6">
          {stackDone ? (
            <div className="card-elevated p-10 text-center">
              <h3 className="font-display text-xl font-semibold">{t("matches.empty.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("matches.empty.desc")}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIndex({ people: 0, places: 0 });
                  }}
                >
                  {t("matches.empty.reset")}
                </Button>
                <Button asChild>
                  <Link to="/dashboard">{t("nav.dashboard")}</Link>
                </Button>
              </div>
            </div>
          ) : tab === "people" ? (
            <SwipeCard key={`p${index.people}`} onSwipe={handleSwipe}>
              <PersonCard data={peopleStack[index.people]} />
            </SwipeCard>
          ) : (
            <SwipeCard key={`pl${index.places}`} onSwipe={handleSwipe}>
              <PlaceCard data={placeStack[index.places]} />
            </SwipeCard>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {matches.filter((m) => m.liked).length} connections so far
        </div>
      </div>
    </div>
  );
}

function FitBadge({ fit }: { fit: FitScore }) {
  const color =
    fit.tier === "excellent"
      ? "from-emerald-500/15 to-emerald-500/5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
      : fit.tier === "good"
        ? "from-primary/15 to-primary/5 border-primary/40 text-primary"
        : fit.tier === "fair"
          ? "from-amber-500/15 to-amber-500/5 border-amber-500/40 text-amber-700 dark:text-amber-300"
          : "from-destructive/15 to-destructive/5 border-destructive/40 text-destructive";
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${color} p-3`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
          <Sparkles className="h-3.5 w-3.5" /> SakhliAI Fit Score
        </div>
        <div className="font-display text-2xl font-bold leading-none">{fit.score}%</div>
      </div>
      <p className="mt-1.5 text-xs leading-snug opacity-90">{fit.summary}</p>
      {fit.financialSafe && (
        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide opacity-80">
          <ShieldCheck className="h-3 w-3" /> Financially safe
        </div>
      )}
    </div>
  );
}

function PersonCard({ data }: { data: { f: Flatmate; fit: FitScore } }) {
  const { f, fit } = data;
  return (
    <div>
      <div className="flex items-start gap-4 bg-gradient-to-br from-accent/15 to-primary/5 p-6">
        <img
          src={f.avatar}
          alt={f.name}
          className="h-20 w-20 rounded-full border-2 border-card bg-card object-cover"
          draggable={false}
        />
        <div className="flex-1">
          <h3 className="font-display text-2xl font-bold">
            {f.name} <span className="text-base font-normal text-muted-foreground">· {f.age}</span>
          </h3>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            {f.university}
          </div>
        </div>
      </div>
      <div className="space-y-3 p-6">
        <FitBadge fit={fit} />
        <p className="text-sm leading-relaxed">{f.bio}</p>
        <div className="flex flex-wrap gap-1.5">
          <Pill>Budget: ₾{f.budget}</Pill>
          <Pill>
            {f.sleep === "night_owl" ? "🌙 night owl" : f.sleep === "early_bird" ? "🌅 early bird" : "🔄 flexible"}
          </Pill>
          <Pill>🧹 {f.cleanliness}/5</Pill>
          {f.pets && <Pill>🐾 pets ok</Pill>}
          {f.smoking && <Pill>🚬 smokes</Pill>}
          {f.quiet && <Pill>🤫 quiet</Pill>}
          {f.parties && <Pill>🎉 parties</Pill>}
        </div>
      </div>
    </div>
  );
}

function PlaceCard({ data }: { data: { p: Property; fit: FitScore } }) {
  const { p, fit } = data;
  return (
    <div>
      <div
        className="h-56 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${p.image})` }}
      />
      <div className="space-y-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold">{p.title}</h3>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {p.district}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-xl font-bold text-gradient">₾{p.price}</div>
            <div className="text-xs text-muted-foreground">/ month</div>
          </div>
        </div>
        <FitBadge fit={fit} />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Bed className="h-4 w-4" /> {p.bedrooms} BR</span>
          <span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" /> Need {p.flatmatesNeeded}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {p.amenities.map((a) => (
            <Pill key={a}>{a}</Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs">
      {children}
    </span>
  );
}
