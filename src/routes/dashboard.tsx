import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { StudentShell } from "@/components/shells/StudentShell";
import { AuthGate } from "@/components/AuthGate";
import { AgentThinking } from "@/components/agent/AgentThinking";
import { SmartContractCard } from "@/components/SmartContract";
import { DisputeResolver } from "@/components/DisputeResolver";
import { CommuteWidget } from "@/components/CommuteWidget";
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
import { supabase } from "@/integrations/supabase/client";
import { flatmates, type Flatmate, properties, type Property } from "@/lib/mock-data";
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
  Sparkles,
  Trash2,
  UserMinus,
  Users,
  Wallet,
  Wifi,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } => ({
    tab: search.tab === "utilities" ? "utilities" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Dashboard — SakhliAI" },
      { name: "description", content: "Your matches, utility splits, and more." },
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
  const navigate = useNavigate();
  const { tab: tabParam } = Route.useSearch();
  const tab: Tab = tabParam === "utilities" ? "utilities" : "matches";
  const [selectedFlatmate, setSelectedFlatmate] = useState<Flatmate | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [dbFlatmates, setDbFlatmates] = useState<Flatmate[]>([]);
  const [dbProperties, setDbProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: profilesData, error: profilesErr } = await supabase
          .from("student_profiles")
          .select("*");
        
        if (profilesData && !profilesErr) {
          const mappedFlatmates = profilesData.map((sp: any) => ({
            id: sp.id,
            name: sp.name || "Student",
            age: 20,
            university: sp.university || "Tbilisi State University",
            budget: sp.budget || 700,
            sleep: sp.sleep || "flexible",
            cleanliness: sp.cleanliness || 3,
            smoking: sp.smoking || false,
            pets: sp.pets || false,
            parties: sp.parties || false,
            quiet: sp.quiet ?? true,
            bio: sp.bio || "",
            avatar: sp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(sp.name || "student")}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
            salaryBracket: sp.salary_bracket || "under_500",
            incomeSource: sp.income_source || "job",
            verified: sp.verified ?? true,
          }));
          setDbFlatmates(mappedFlatmates);
        }

        const { data: propsData, error: propsErr } = await supabase
          .from("properties")
          .select("*");

        if (propsData && !propsErr) {
          const mappedProps = propsData.map((p: any) => ({
            id: p.id,
            title: p.title,
            district: p.address ? p.address.split(",")[0] : p.city || "Tbilisi",
            address: p.address || "",
            description: p.description || "",
            price: Number(p.price_per_month) || 1200,
            bedrooms: p.bedrooms || 2,
            flatmatesNeeded: p.bedrooms || 2,
            amenities: p.amenities || [],
            image: p.image_url || "",
          }));
          setDbProperties(mappedProps);
        }
      } catch (err) {
        console.error("Error loading real data from Supabase:", err);
      }
    }
    loadData();
  }, []);

  const activeFlatmates = dbFlatmates.length > 0 ? dbFlatmates : flatmates;
  const activeProperties = dbProperties.length > 0 ? dbProperties : properties;

  const likedPeople = matches
    .filter((m) => m.kind === "person" && m.liked)
    .map((m) => activeFlatmates.find((f) => f.id === m.id))
    .filter((f): f is Flatmate => Boolean(f));

  const likedPlaces = matches
    .filter((m) => m.kind === "place" && m.liked)
    .map((m) => activeProperties.find((p) => p.id === m.id))
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
      onClick={() => navigate({ to: "/dashboard", search: v === "utilities" ? { tab: "utilities" } : {} })}
      className={[
        "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        tab === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <StudentShell>
      <div className="mx-auto max-w-5xl">
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
                            {t("dashboard.addMatch")}
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
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <h2 className="font-display text-lg font-semibold">{t("matches.tab.places")}</h2>
                        <Button asChild size="sm" variant="outline">
                          <Link to="/matches">
                            <Plus className="mr-1 h-3.5 w-3.5" />
                            {t("dashboard.addProperty")}
                          </Link>
                        </Button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {likedPlaces.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setSelectedProperty(p)}
                            className="card-elevated overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-primary/40"
                          >
                            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                            <div className="p-3">
                              <div className="truncate font-medium">{p.title}</div>
                              <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="truncate">{p.district}</span>
                                <span className="font-semibold text-foreground">₾{p.price}</span>
                              </div>
                            </div>
                          </button>
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
      <PropertyDetailsDialog
        property={selectedProperty}
        university={profile?.university}
        onOpenChange={(open) => !open && setSelectedProperty(null)}
        onUnmatch={handleUnmatchProperty}
      />
    </StudentShell>
  );
}

/* -------- Property details dialog -------- */
function PropertyDetailsDialog({
  property,
  university,
  onOpenChange,
  onUnmatch,
}: {
  property: Property | null;
  university?: string;
  onOpenChange: (open: boolean) => void;
  onUnmatch: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <Dialog open={!!property} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {property && (
          <>
            <div
              className="-mx-6 -mt-6 mb-3 h-44 bg-cover bg-center"
              style={{ backgroundImage: `url(${property.image})` }}
            />
            <DialogHeader>
              <DialogTitle className="font-display text-xl">{property.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1 text-left">
                <MapPin className="h-3.5 w-3.5" />
                {property.address ?? property.district}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 flex items-center justify-between rounded-md border border-border bg-secondary/50 p-3">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground">Monthly rent</div>
                <div className="font-display text-2xl font-bold text-gradient">
                  ₾ {property.price}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>{property.bedrooms} BR · need {property.flatmatesNeeded}</div>
                <div className="mt-0.5">{property.district}</div>
              </div>
            </div>

            {property.description && (
              <p className="mt-3 rounded-md bg-secondary/50 p-3 text-sm text-muted-foreground">
                {property.description}
              </p>
            )}

            <div className="mt-3">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Amenities
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-border bg-secondary px-2 py-0.5 text-xs"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <CommuteWidget university={university} district={property.district} />
            </div>

            <div className="mt-5 flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => onUnmatch(property.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("dashboard.removeProperty")}
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
  const { t } = useI18n();
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
                {t("dashboard.unmatch")}
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
  const { t, locale } = useI18n();
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

  // Brief "agent is recalculating" beat whenever the inputs change.
  const [recalcing, setRecalcing] = useState(false);
  useEffect(() => {
    setRecalcing(true);
    const id = window.setTimeout(() => setRecalcing(false), 650);
    return () => window.clearTimeout(id);
  }, [total, mode, roommates]);

  const splits = useMemo(() => {
    if (mode === "equal" || roommates.length === 0) {
      const per = roommates.length ? total / roommates.length : 0;
      return roommates.map((r) => ({
        ...r,
        owes: per,
        days: monthDays,
        reason: t("util.reason.equal", { n: roommates.length }),
      }));
    }
    // Move-in date weighted: each person owes proportional to days occupied
    const occ = roommates.map((r) => ({ ...r, days: Math.max(1, monthDays - r.moveInDay + 1) }));
    const totalDays = occ.reduce((s, o) => s + o.days, 0);
    const maxDays = Math.max(...occ.map((o) => o.days));
    return occ.map((o) => ({
      ...o,
      owes: total * (o.days / totalDays),
      reason:
        o.days === maxDays
          ? t("util.reason.most", { d: o.moveInDay, days: o.days })
          : t("util.reason.less", { d: o.moveInDay, days: o.days }),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills, roommates, mode, total, locale]);

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
                <Home className="h-3.5 w-3.5" /> {t("util.linked")}
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
            {t("util.notlinked")}
          </div>
        )}

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">{t("util.title")}</h2>
            <p className="text-sm text-muted-foreground">{t("util.desc")}</p>
          </div>
          <div className="inline-flex shrink-0 rounded-lg border border-border bg-secondary p-1 text-sm">
            <button
              onClick={() => setMode("movein")}
              className={`rounded-md px-3 py-1.5 transition-colors ${mode === "movein" ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("util.mode.movein")}
            </button>
            <button
              onClick={() => setMode("equal")}
              className={`rounded-md px-3 py-1.5 transition-colors ${mode === "equal" ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("util.mode.equal")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Bills */}
        <div className="card-elevated p-5">
          <h3 className="font-display text-base font-semibold">{t("util.bills")}</h3>
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
                    <div className="text-xs text-muted-foreground">{t("util.monthly")}</div>
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
              placeholder={t("util.amount")}
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
              <Plus className="mr-1 h-4 w-4" /> {t("util.add")}
            </Button>
          </div>
        </div>

        {/* Flatmates */}
        <div className="card-elevated p-5">
          <h3 className="font-display text-base font-semibold">{t("util.flatmates")}</h3>

          <div className="mt-4 space-y-2">
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
                    <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">{t("util.day")}</Label>
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
              setRoommates((rs) => [
                ...rs, 
                { 
                  id: crypto.randomUUID(), 
                  name: locale === "ka" ? `თანამცხოვრები ${rs.length + 1}` : `Flatmate ${rs.length + 1}`, 
                  moveInDay: 1 
                }
              ])
            }
          >
            <Plus className="mr-1 h-4 w-4" /> {t("util.addFlatmate")}
          </Button>

        </div>
      </div>

      {/* Summary + payment (full width) */}
      <div className="card-elevated grid items-center gap-5 p-5 md:grid-cols-[minmax(0,16rem)_1fr]">
        <div className="rounded-xl bg-gradient-to-br from-primary/90 to-primary p-5 text-primary-foreground">
          <div className="text-xs opacity-70">{t("util.total")}</div>
          <div className="font-display text-3xl font-bold">₾ {total.toFixed(2)}</div>
          <div className="mt-1 text-[11px] opacity-70">
            {mode === "movein" ? t("util.split.movein") : t("util.split.equal")}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("util.pay")}
          </div>
          {payStatus === "paid" ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-3 text-sm font-semibold text-emerald-600 shadow-[0_0_24px_rgba(16,185,129,0.45)] dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <div className="flex-1">
                {t("util.paid")}
                <div className="text-[11px] font-normal opacity-80">
                  {t("util.via")} {payBank === "TBC" ? t("util.pay.tbc") : t("util.pay.bog")} · ₾{total.toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-3 grid max-w-md grid-cols-2 gap-2">
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
                <span className="text-[10px] uppercase opacity-90">{t("util.pay.tbc")}</span>
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
                <span className="text-[10px] uppercase opacity-90">{t("util.pay.bog")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Per-person breakdown */}
      <div className="card-elevated p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-semibold">{t("util.who")}</h3>
          {recalcing ? (
            <AgentThinking label={t("util.calc")} />
          ) : (
            <span className="text-xs text-muted-foreground">{t("util.reasoning")}</span>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {splits.map((s) => (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{s.name}</div>
                {mode === "movein" && (
                  <Badge variant="secondary" className="text-[10px]">{s.days} {t("util.days")}</Badge>
                )}
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-gradient">
                ₾ {s.owes.toFixed(2)}
              </div>
              <p className="mt-1.5 flex items-start gap-1 text-[11px] leading-snug text-muted-foreground">
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                {s.reason}
              </p>
              <Button
                size="sm"
                className="mt-3 w-full"
                disabled={s.id === "me"}
                onClick={() => alert(`Mock: requesting ₾${s.owes.toFixed(2)} from ${s.name}`)}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                {s.id === "me" ? t("util.yourShare") : t("util.payRoommate")}
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-accent/30 bg-accent/5 p-3 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-accent" />
          <div>
            <strong className="text-foreground">{t("util.fairness")}</strong> {locale === "ka" ? "ჯამი ემთხვევა" : "totals reconcile to"} ₾{total.toFixed(2)}.
            {t("util.fairness.desc")}
          </div>
        </div>
      </div>

      <div className="card-elevated p-5">
        <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          {t("dashboard.aiHouseRules")}
        </div>
        <p className="mb-3 text-sm text-muted-foreground">
          {t("dashboard.aiHouseRulesDesc")}
        </p>
        <DisputeResolver />
      </div>

      {/* hidden text helper for i18n keys referenced elsewhere */}
      <span className="sr-only">{t("utilities.total")}</span>
    </div>
  );
}

