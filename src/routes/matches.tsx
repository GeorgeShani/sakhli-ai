import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useI18n } from "@/lib/i18n";
import { useMatches, useProfile, defaultProfile, type StudentProfile } from "@/lib/student-store";
import {
  flatmates,
  properties,
  fitScoreForFlatmate,
  fitScoreForProperty,
  aiAssistantBullets,
  type Flatmate,
  type Property,
  type FitScore,
  type AssistantBullet,
} from "@/lib/mock-data";
import { CommuteWidget } from "@/components/CommuteWidget";
import { PricingModal } from "@/components/PricingModal";
import { useSubscription } from "@/lib/subscription";
import {
  Bed,
  MapPin,
  GraduationCap,
  BedDouble,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Coins,
  Moon,
  Brush,
  AlertTriangle,
  Wand2,
  Crown,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Matches — SakhliAI" },
      { name: "description", content: "Swipe through compatible flatmates and homes." },
    ],
  }),
  component: () => (
    <AuthGate>
      <MatchesPage />
    </AuthGate>
  ),
});

type Tab = "people" | "places";

function MatchesPage() {
  const { t } = useI18n();
  const { profile, loaded } = useProfile();
  const { matches, record, reset } = useMatches();
  const { isPaid, bumpSwipes, swipeBlocked, swipesLeft, resetSwipes } = useSubscription();
  const [tab, setTab] = useState<Tab>("people");
  const [index, setIndex] = useState({ people: 0, places: 0 });
  const [aiBestFit, setAiBestFit] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [pricingReason, setPricingReason] = useState<"swipe_limit" | "ai_best_fit" | "manual">("manual");

  const effectiveProfile: StudentProfile = profile ?? defaultProfile;

  const peopleStack = useMemo(() => {
    const ranked = flatmates
      .map((f) => ({ f, fit: fitScoreForFlatmate(effectiveProfile, f) }))
      .sort((a, b) => b.fit.score - a.fit.score);
    return aiBestFit && isPaid ? ranked.filter((r) => r.fit.score >= 85) : ranked;
  }, [effectiveProfile, aiBestFit, isPaid]);

  const placeStack = useMemo(() => {
    const ranked = properties
      .map((p) => ({ p, fit: fitScoreForProperty(effectiveProfile, p) }))
      .sort((a, b) => b.fit.score - a.fit.score);
    return aiBestFit && isPaid ? ranked.filter((r) => r.fit.score >= 85) : ranked;
  }, [effectiveProfile, aiBestFit, isPaid]);

  if (!loaded) return null;

  const handleSwipe = (liked: boolean) => {
    if (swipeBlocked) {
      setPricingReason("swipe_limit");
      setPricingOpen(true);
      return;
    }
    if (tab === "people") {
      const current = peopleStack[index.people];
      if (current) record("person", current.f.id, liked);
      setIndex((i) => ({ ...i, people: i.people + 1 }));
    } else {
      const current = placeStack[index.places];
      if (current) record("place", current.p.id, liked);
      setIndex((i) => ({ ...i, places: i.places + 1 }));
    }
    if (!isPaid) bumpSwipes();
  };

  const handleAiToggle = (checked: boolean) => {
    if (checked && !isPaid) {
      setPricingReason("ai_best_fit");
      setPricingOpen(true);
      return;
    }
    setAiBestFit(checked);
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

        <div className="mt-3 flex items-center justify-between rounded-lg border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-primary/5 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 ${
                  aiBestFit && isPaid ? "animate-ping" : "hidden"
                }`}
              />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                AI Best Fit
                {!isPaid && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
                    <Lock className="h-2.5 w-2.5" /> Plus
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground">
                Show only matches ≥ 85% · მხოლოდ ≥85%-ის ჩვენება
              </div>
            </div>
          </div>
          <Switch checked={aiBestFit && isPaid} onCheckedChange={handleAiToggle} aria-label="AI Best Fit" />
        </div>

        {!isPaid && (
          <div className="mt-2 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-[11px]">
            <span className="text-muted-foreground">
              Free plan · <span className="font-semibold text-foreground">{swipesLeft}</span> swipes left
            </span>
            <button
              type="button"
              onClick={() => {
                setPricingReason("manual");
                setPricingOpen(true);
              }}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
            >
              <Crown className="h-3 w-3" /> განაახლეთ ტარიფი / Upgrade
            </button>
          </div>
        )}

        <div className="mt-6">
          {swipeBlocked ? (
            <div className="card-elevated p-10 text-center">
              <Lock className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-3 font-display text-xl font-semibold">
                მიაღწიე უფასო ლიმიტს · Free swipe limit reached
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                განაახლეთ ტარიფი შეუზღუდავი მატჩებისთვის. · Upgrade to keep swiping unlimited matches.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    setPricingReason("swipe_limit");
                    setPricingOpen(true);
                  }}
                >
                  <Crown className="mr-1.5 h-4 w-4" /> განაახლეთ ტარიფი / Switch Plans
                </Button>
                <FreeSwipeCountdown />
                <Button asChild variant="outline">
                  <Link to="/dashboard">{t("nav.dashboard")}</Link>
                </Button>
              </div>
            </div>
          ) : stackDone ? (
            <div className="card-elevated p-10 text-center">
              <h3 className="font-display text-xl font-semibold">{t("matches.empty.title")}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t("matches.empty.desc")}</p>
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    resetSwipes();
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

      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} reason={pricingReason} />
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
  const { profile } = useProfile();
  const effective = profile ?? defaultProfile;
  const bullets = useMemo(() => aiAssistantBullets(effective, f), [effective, f]);
  const isAiPick = fit.score > 85;

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
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-2xl font-bold">
              {f.name} <span className="text-base font-normal text-muted-foreground">· {f.age}</span>
            </h3>
            {isAiPick && (
              <span className="relative inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.55)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                AI Recommended
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <GraduationCap className="h-3.5 w-3.5" />
            {f.university}
          </div>
          {f.verified && (
            <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.45)]">
              <ShieldCheck className="h-3 w-3" />
              Verified Student
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3 p-6">
        <FitBadge fit={fit} />
        <AssistantBubble bullets={bullets} />
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

function bulletIcon(kind: AssistantBullet["icon"]) {
  const cls = "h-3.5 w-3.5 shrink-0 mt-0.5";
  switch (kind) {
    case "money":
      return <Coins className={`${cls} text-emerald-500`} />;
    case "schedule":
      return <Moon className={`${cls} text-indigo-400`} />;
    case "habit":
      return <Brush className={`${cls} text-primary`} />;
    case "warning":
      return <AlertTriangle className={`${cls} text-amber-500`} />;
    default:
      return <Sparkles className={`${cls} text-accent`} />;
  }
}

function AssistantBubble({ bullets }: { bullets: AssistantBullet[] }) {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        className="group flex w-full items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 px-3 py-2.5 text-left transition-colors hover:from-primary/15 hover:to-accent/15"
        onMouseEnter={() => setOpen(true)}
      >
        <span className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Wand2 className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            SakhliAI ასისტენტი
          </span>
          <span className="hidden text-[11px] text-muted-foreground sm:inline">
            · რატომ გერჩევთ
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <ul className="mt-2 space-y-1.5 rounded-xl border border-border bg-card p-3 text-[13px] leading-snug text-foreground shadow-sm">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              {bulletIcon(b.icon)}
              <span>{b.text}</span>
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}


function PlaceCard({ data }: { data: { p: Property; fit: FitScore } }) {
  const { p, fit } = data;
  const { profile } = useProfile();
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
        <CommuteWidget university={profile?.university} district={p.district} />
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
