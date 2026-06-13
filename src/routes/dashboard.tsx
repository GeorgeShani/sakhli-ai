import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { SmartContractCard } from "@/components/SmartContract";
import { DisputeResolver } from "@/components/DisputeResolver";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { useMatches, useProfile } from "@/lib/student-store";
import { flatmates, type Flatmate, properties } from "@/lib/mock-data";
import {
  CheckCircle2,
  Droplet,
  Flame,
  Home,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  UserMinus,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SakhliAI" },
      { name: "description", content: "Your matches, utility splits, and chats." },
    ],
  }),
  component: () => (
    <AuthGate>
      <DashboardPage />
    </AuthGate>
  ),
});

type Tab = "matches" | "utilities";

function DashboardPage() {
  const { t } = useI18n();
  const { profile } = useProfile();
  const { matches, record } = useMatches();
  const [tab, setTab] = useState<Tab>("matches");
  const [selectedFlatmate, setSelectedFlatmate] = useState<Flatmate | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const likedPeople = matches
    .filter((m) => m.kind === "person" && m.liked)
    .map((m) => flatmates.find((f) => f.id === m.id))
    .filter((f): f is Flatmate => Boolean(f));

  const likedPlaces = matches
    .filter((m) => m.kind === "place" && m.liked)
    .map((m) => properties.find((p) => p.id === m.id))
    .filter((p): p is Property => Boolean(p));

  const handleUnmatch = (id: string) => {
    record("person", id, false);
    setSelectedFlatmate(null);
  };

  const handleUnmatchProperty = (id: string) => {
    record("place", id, false);
    setSelectedProperty(null);
  };



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

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {t("dashboard.title")}
            {profile?.name && <span className="text-muted-foreground"> · {profile.name}</span>}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        {/* Profile / financial summary */}
        {profile && <ProfileCard profile={profile} />}

        <div className="mt-6 flex rounded-lg border border-border bg-secondary p-1">
          {tabBtn("matches", t("dashboard.tab.matches"))}
          {tabBtn("utilities", t("dashboard.tab.utilities"))}
        </div>

        <div className="mt-6">
          {tab === "matches" && (
            <div className="space-y-6">
              {likedPeople.length === 0 && likedPlaces.length === 0 ? (
                <div className="card-elevated p-10 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">{t("dashboard.matches.empty")}</p>
                  <Button asChild className="mt-4">
                    <Link to="/matches">{t("dashboard.matches.go")}</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {likedPeople.length > 0 && (
                    <section>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="font-display text-lg font-semibold">{t("matches.tab.people")}</h2>
                        <Button asChild size="sm" variant="outline">
                          <Link to="/matches">
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            ახალი თანამცხოვრებლის დამატება / Add New Match
                          </Link>
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {likedPeople.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFlatmate(f)}
                            className="card-elevated flex items-center gap-3 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-primary/40"
                          >
                            <img src={f.avatar} alt={f.name} className="h-12 w-12 rounded-full bg-secondary" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{f.name}</div>
                              <div className="truncate text-xs text-muted-foreground">{f.university}</div>
                            </div>
                            {f.verified && <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  {likedPlaces.length > 0 && (
                    <section>
                      <h2 className="mb-3 font-display text-lg font-semibold">{t("matches.tab.places")}</h2>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {likedPlaces.map((p) => p && (
                          <div key={p.id} className="card-elevated overflow-hidden">
                            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                            <div className="p-3">
                              <div className="truncate font-medium">{p.title}</div>
                              <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="truncate">{p.district}</span>
                                <span className="font-semibold text-foreground">₾{p.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {likedPlaces[0] && (
                    <section>
                      <SmartContractCard
                        propertyTitle={likedPlaces[0]!.title}
                        district={likedPlaces[0]!.district}
                        monthlyRent={likedPlaces[0]!.price}
                        tenantName={profile?.name || "Student"}
                      />
                    </section>
                  )}
                </>
              )}
            </div>
          )}

          {tab === "utilities" && (
            <UtilitySplitter
              flatmateNames={likedPeople.map((f) => f.name)}
              activeProperty={likedPlaces[0] ?? undefined}
            />
          )}
        </div>
      </div>

      <FlatmateDetailsDialog
        flatmate={selectedFlatmate}
        onOpenChange={(open) => !open && setSelectedFlatmate(null)}
        onUnmatch={handleUnmatch}
      />
    </div>
  );
}

/* -------- Flatmate details dialog -------- */
function FlatmateDetailsDialog({
  flatmate,
  onOpenChange,
  onUnmatch,
}: {
  flatmate: Flatmate | null;
  onOpenChange: (open: boolean) => void;
  onUnmatch: (id: string) => void;
}) {
  const sleepLabel: Record<Flatmate["sleep"], string> = {
    early_bird: "🌅 Early bird",
    night_owl: "🌙 Night owl",
    flexible: "🔄 Flexible",
  };
  // Deterministic mock compatibility breakdown
  const score = flatmate
    ? 70 + ((flatmate.id.charCodeAt(flatmate.id.length - 1) * 7) % 30)
    : 0;
  const breakdown = flatmate
    ? [
        { label: "Lifestyle", value: Math.min(100, score + 5) },
        { label: "Budget", value: Math.max(60, score - 8) },
        { label: "Cleanliness", value: 60 + flatmate.cleanliness * 8 },
        { label: "Schedule", value: flatmate.sleep === "flexible" ? 95 : 82 },
      ]
    : [];

  return (
    <Dialog open={!!flatmate} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {flatmate && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4">
                <img
                  src={flatmate.avatar}
                  alt={flatmate.name}
                  className="h-16 w-16 rounded-full bg-secondary ring-2 ring-primary/30"
                />
                <div className="min-w-0 flex-1 text-left">
                  <DialogTitle className="flex items-center gap-2 font-display text-xl">
                    {flatmate.name}
                    {flatmate.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> Verified
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5">
                    {flatmate.university} · age {flatmate.age}
                  </DialogDescription>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-primary to-accent px-3 py-2 text-center text-primary-foreground shadow">
                  <div className="text-[10px] uppercase opacity-80">Match</div>
                  <div className="font-display text-xl font-bold">{score}%</div>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-secondary/50 p-2 text-xs">
              <Mail className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium">Academic email verified</span>
              <span className="ml-auto text-muted-foreground">.edu.ge</span>
            </div>

            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Compatibility breakdown
              </div>
              <div className="mt-2 space-y-2">
                {breakdown.map((b) => (
                  <div key={b.label}>
                    <div className="flex justify-between text-xs">
                      <span>{b.label}</span>
                      <span className="font-semibold">{b.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${b.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border border-border bg-card p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Sleep</div>
                <div className="mt-0.5">{sleepLabel[flatmate.sleep]}</div>
              </div>
              <div className="rounded-md border border-border bg-card p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Cleanliness</div>
                <div className="mt-0.5">🧹 {flatmate.cleanliness}/5</div>
              </div>
              <div className="rounded-md border border-border bg-card p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Budget</div>
                <div className="mt-0.5 font-semibold">₾ {flatmate.budget}</div>
              </div>
              <div className="rounded-md border border-border bg-card p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Lifestyle</div>
                <div className="mt-0.5 text-xs">
                  {flatmate.smoking ? "🚬 " : ""}
                  {flatmate.pets ? "🐾 " : ""}
                  {flatmate.parties ? "🎉 " : "🤫 "}
                  {flatmate.quiet ? "Quiet" : "Social"}
                </div>
              </div>
            </div>

            <p className="mt-3 rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
              {flatmate.bio}
            </p>

            <div className="mt-5 flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onUnmatch(flatmate.id)}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                კავშირის გაწყვეტა / Unmatch
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}


/* -------- Profile card (lifestyle only, no income) -------- */
function ProfileCard({ profile }: { profile: ReturnType<typeof useProfile>["profile"] }) {
  if (!profile) return null;
  return (
    <div className="card-elevated mt-6 grid gap-4 p-5 md:grid-cols-3">
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Profile</div>
        <div className="mt-1 flex items-center gap-2 font-display text-lg font-semibold">
          {profile.name || "Student"}
          {profile.verified && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">{profile.university || "—"}</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Wallet className="h-3.5 w-3.5" /> Budget
        </div>
        <div className="mt-1 font-display text-xl font-bold">₾ {profile.budget}</div>
        <div className="text-xs text-muted-foreground">monthly target</div>
      </div>
      <div className="rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> Lifestyle
        </div>
        <div className="mt-1 text-sm">
          {profile.sleep === "night_owl" ? "🌙 Night owl" : profile.sleep === "early_bird" ? "🌅 Early bird" : "🔄 Flexible"} ·
          🧹 {profile.cleanliness}/5
        </div>
      </div>
    </div>
  );
}

/* -------- AI Utility Bill Splitter -------- */
type Bill = { id: string; category: string; icon: typeof Zap; amount: number };

const CATEGORY_ICONS: Record<string, typeof Zap> = {
  Electricity: Zap,
  Water: Droplet,
  Gas: Flame,
  Internet: Wifi,
};

type Roommate = { id: string; name: string; moveInDay: number };

function UtilitySplitter({
  flatmateNames,
  activeProperty,
}: {
  flatmateNames: string[];
  activeProperty?: (typeof properties)[number];
}) {
  const { t } = useI18n();
  const [bills, setBills] = useState<Bill[]>([
    { id: "1", category: "Electricity", icon: Zap, amount: 140 },
    { id: "2", category: "Water", icon: Droplet, amount: 40 },
    { id: "3", category: "Gas", icon: Flame, amount: 95 },
    { id: "4", category: "Internet", icon: Wifi, amount: 60 },
  ]);
  const [roommates, setRoommates] = useState<Roommate[]>(() => {
    const base: Roommate[] = [{ id: "me", name: "You", moveInDay: 1 }];
    flatmateNames.slice(0, 2).forEach((n, i) =>
      base.push({ id: `r${i}`, name: n, moveInDay: i === 0 ? 8 : 15 }),
    );
    if (base.length === 1) {
      base.push({ id: "r0", name: "Nino", moveInDay: 8 });
      base.push({ id: "r1", name: "Giorgi", moveInDay: 15 });
    }
    return base;
  });
  const [mode, setMode] = useState<"equal" | "movein">("movein");
  const [category, setCategory] = useState("Electricity");
  const [amount, setAmount] = useState("");
  const [payStatus, setPayStatus] = useState<"idle" | "processing" | "paid">("idle");
  const [payBank, setPayBank] = useState<"TBC" | "BOG" | null>(null);
  const monthDays = 30;

  const pay = (bank: "TBC" | "BOG") => {
    if (payStatus === "processing") return;
    setPayBank(bank);
    setPayStatus("processing");
    window.setTimeout(() => setPayStatus("paid"), 1200);
  };

  const total = bills.reduce((s, b) => s + b.amount, 0);

  const splits = useMemo(() => {
    if (mode === "equal" || roommates.length === 0) {
      const per = roommates.length ? total / roommates.length : 0;
      return roommates.map((r) => ({ ...r, owes: per, days: monthDays }));
    }
    // Move-in date weighted: each person owes proportional to days occupied
    const occ = roommates.map((r) => ({ ...r, days: Math.max(1, monthDays - r.moveInDay + 1) }));
    const totalDays = occ.reduce((s, o) => s + o.days, 0);
    return occ.map((o) => ({ ...o, owes: total * (o.days / totalDays) }));
  }, [bills, roommates, mode, total]);

  return (
    <div className="space-y-6">
      <div className="card-elevated overflow-hidden">
        {activeProperty ? (
          <div className="flex flex-col gap-4 border-b border-border bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-5 sm:flex-row sm:items-center">
            <div
              className="h-20 w-28 shrink-0 rounded-lg bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url(${activeProperty.image})` }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Home className="h-3.5 w-3.5" /> კომუნალურების დაყოფა · Splitting bills for
              </div>
              <div className="mt-0.5 truncate font-display text-lg font-semibold">
                {activeProperty.title}
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {activeProperty.district} · ₾{activeProperty.price}/mo
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 border-b border-dashed border-border bg-muted/40 p-4 text-xs text-muted-foreground">
            <Home className="h-4 w-4" />
            აირჩიეთ ან მონიშნეთ ბინა Matches გვერდზე, რომ კალკულატორი დაუკავშირდეს კონკრეტულ ბინას.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <h2 className="font-display text-lg font-semibold">
              AI Utility Bill Splitter · სტუდენტური კომუნალურების გამყოფი
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeProperty
                ? `მონაცემები ეხება: ${activeProperty.title}`
                : "Track monthly utilities and split fairly by move-in dates or equally."}
            </p>
          </div>
          <div className="flex rounded-md border border-border bg-secondary p-1 text-xs">
            <button
              onClick={() => setMode("movein")}
              className={`rounded px-3 py-1.5 ${mode === "movein" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              By move-in dates
            </button>
            <button
              onClick={() => setMode("equal")}
              className={`rounded px-3 py-1.5 ${mode === "equal" ? "bg-card font-medium shadow-sm" : "text-muted-foreground"}`}
            >
              Equal split
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Bills */}
        <div className="card-elevated p-5">
          <h3 className="font-display text-base font-semibold">Monthly bills</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {bills.map((b) => {
              const Icon = CATEGORY_ICONS[b.category] ?? Zap;
              return (
                <div key={b.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{b.category}</div>
                    <div className="text-xs text-muted-foreground">monthly</div>
                  </div>
                  <Input
                    type="number"
                    className="h-8 w-20"
                    value={b.amount}
                    onChange={(e) =>
                      setBills((bs) =>
                        bs.map((x) => (x.id === b.id ? { ...x, amount: Number(e.target.value) || 0 } : x)),
                      )
                    }
                  />
                  <span className="text-xs text-muted-foreground">GEL</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setBills((bs) => bs.filter((x) => x.id !== b.id))}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_120px_auto]">
            <select
              className="h-9 rounded-md border border-input bg-background px-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(CATEGORY_ICONS).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={() => {
                const a = parseFloat(amount);
                if (!Number.isFinite(a) || a <= 0) return;
                setBills((bs) => [
                  ...bs,
                  { id: crypto.randomUUID(), category, icon: CATEGORY_ICONS[category] ?? Zap, amount: a },
                ]);
                setAmount("");
              }}
            >
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>

        {/* Roommates & splits */}
        <div className="card-elevated h-fit p-5">
          <h3 className="font-display text-base font-semibold">Flatmates</h3>
          <div className="mt-3 space-y-2">
            {roommates.map((r, i) => (
              <div key={r.id} className="flex items-center gap-2 rounded-md border border-border bg-card p-2">
                <Input
                  value={r.name}
                  onChange={(e) =>
                    setRoommates((rs) => rs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                  }
                  className="h-8 flex-1"
                />
                {mode === "movein" && (
                  <div className="flex items-center gap-1">
                    <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">Day</Label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      className="h-8 w-14"
                      value={r.moveInDay}
                      onChange={(e) =>
                        setRoommates((rs) =>
                          rs.map((x, j) => (j === i ? { ...x, moveInDay: Math.max(1, Math.min(30, Number(e.target.value) || 1)) } : x)),
                        )
                      }
                    />
                  </div>
                )}
                {roommates.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setRoommates((rs) => rs.filter((_, j) => j !== i))}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={() =>
              setRoommates((rs) => [...rs, { id: crypto.randomUUID(), name: `Flatmate ${rs.length + 1}`, moveInDay: 1 }])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> Add flatmate
          </Button>

          <div className="mt-5 rounded-xl bg-gradient-to-br from-primary/90 to-primary p-4 text-primary-foreground">
            <div className="text-xs opacity-70">Monthly total</div>
            <div className="font-display text-2xl font-bold">₾ {total.toFixed(2)}</div>
            <div className="mt-1 text-[11px] opacity-70">{mode === "movein" ? "Split by move-in days" : "Equal split"}</div>
          </div>

          {/* Localized payment */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              გადახდა · Proceed to Pay
            </div>
            {payStatus === "paid" ? (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-600 shadow-[0_0_24px_rgba(16,185,129,0.45)] dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <div className="flex-1">
                  გადახდილია წარმატებით · Paid Successfully
                  <div className="text-[11px] font-normal opacity-80">
                    via {payBank === "TBC" ? "TBC Bank" : "Bank of Georgia"} · ₾{total.toFixed(2)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => pay("TBC")}
                  disabled={payStatus === "processing"}
                  className="group relative flex flex-col items-center justify-center gap-1 rounded-lg border border-[#00669b]/40 bg-gradient-to-br from-[#00669b] to-[#004e7c] px-3 py-3 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
                >
                  {payStatus === "processing" && payBank === "TBC" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="font-display text-base font-extrabold tracking-tight">TBC</span>
                  )}
                  <span className="text-[10px] uppercase opacity-90">TBC Bank</span>
                </button>
                <button
                  type="button"
                  onClick={() => pay("BOG")}
                  disabled={payStatus === "processing"}
                  className="group relative flex flex-col items-center justify-center gap-1 rounded-lg border border-[#ff6f00]/40 bg-gradient-to-br from-[#ff6f00] to-[#cc4f00] px-3 py-3 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-70"
                >
                  {payStatus === "processing" && payBank === "BOG" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="font-display text-base font-extrabold tracking-tight">BOG</span>
                  )}
                  <span className="text-[10px] uppercase opacity-90">Bank of Georgia</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Per-person breakdown */}
      <div className="card-elevated p-5">
        <h3 className="font-display text-base font-semibold">Who pays what</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {splits.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.name}</div>
                {mode === "movein" && (
                  <Badge variant="secondary" className="text-[10px]">{s.days} days</Badge>
                )}
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-gradient">
                ₾ {s.owes.toFixed(2)}
              </div>
              <Button
                size="sm"
                className="mt-3 w-full"
                disabled={s.id === "me"}
                onClick={() => alert(`Mock: requesting ₾${s.owes.toFixed(2)} from ${s.name}`)}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {s.id === "me" ? "Your share" : "Pay to roommate"}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" />
          <div>
            <strong className="text-foreground">AI fairness check:</strong> totals reconcile to ₾{total.toFixed(2)}.
            Payments are mocked — connect a Georgian PSP (TBC Pay / BoG) to enable real transfers.
          </div>
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          AI House Rules · კონფლიქტების მედიატორი
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          არ ეთანხმები flatmate-ს? AI გააანალიზებს onboarding-ის ჩვევებს და გასცემს კომპრომისს.
        </p>
        <DisputeResolver />
      </div>

      {/* hidden text helper for i18n keys referenced elsewhere */}
      <span className="sr-only">{t("utilities.total")}</span>
    </div>
  );
}

