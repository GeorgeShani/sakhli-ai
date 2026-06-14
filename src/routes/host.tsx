import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Radio,
  Sparkles,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  MapPin,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Link2,
} from "lucide-react";
import { screenApplicant } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { HostShell, type HostSection } from "@/components/shells/HostShell";
import { DemandMap } from "@/components/DemandMap";
import { SmartContractCard } from "@/components/SmartContract";
import { AuthGate } from "@/components/AuthGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/host")({
  validateSearch: (search: Record<string, unknown>): { section?: HostSection } => {
    const s = search.section;
    return {
      section:
        s === "calendar" || s === "channels" || s === "applicants" || s === "operations"
          ? s
          : undefined,
    };
  },
  component: () => (
    <AuthGate>
      <HostPage />
    </AuthGate>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center text-destructive">Failed to load: {error.message}</div>
  ),
  notFoundComponent: () => <div className="p-8">Not found</div>,
});

type Property = {
  id: string;
  title: string;
  city: string | null;
  address: string | null;
  image_url: string | null;
  listing_type: string;
  price_per_night: number | null;
};

type Booking = {
  id: string;
  property_id: string;
  guest_name: string | null;
  channel: string;
  booking_type: string;
  check_in: string;
  check_out: string;
  status: string;
  total_price: number | null;
  guests_count: number | null;
  created_at: string;
};

type ChannelSync = {
  id: string;
  property_id: string;
  channel: string;
  enabled: boolean;
  status: string;
  last_synced_at: string | null;
  ical_url: string | null;
};

type CleaningTask = {
  id: string;
  property_id: string;
  cleaner_name: string | null;
  cleaner_phone: string | null;
  scheduled_for: string;
  status: string;
  notes: string | null;
};

const CHANNEL_META: Record<string, { label: string; color: string; logo: string; logoColor: string }> = {
  airbnb: { label: "Airbnb", color: "bg-rose-500", logo: "A", logoColor: "text-rose-500" },
  booking: { label: "Booking.com", color: "bg-blue-500", logo: "B.", logoColor: "text-blue-500" },
  sakliai: { label: "SakhliAI", color: "bg-primary", logo: "Sა", logoColor: "text-primary" },
  student: { label: "Student", color: "bg-emerald-500", logo: "🎓", logoColor: "text-emerald-500" },
  direct: { label: "Direct", color: "bg-amber-500", logo: "★", logoColor: "text-amber-500" },
};

// Curated default catalog used when the host has no properties in the DB yet.
const DEFAULT_PROPERTIES: Property[] = [
  {
    id: "default-saburtalo-101",
    title: "საბურთალოს სტუდენტური ჰაბი #101 (Saburtalo Flat near Technical Uni)",
    city: "Saburtalo",
    address: "Pekini Ave, near GTU",
    image_url: null,
    listing_type: "hybrid",
    price_per_night: 55,
  },
  {
    id: "default-vake-204",
    title: "ვაკის მინიმალისტური აპარტამენტი #204 (Vake Suite near Iliauni)",
    city: "Vake",
    address: "Chavchavadze Ave, near ISU",
    image_url: null,
    listing_type: "hybrid",
    price_per_night: 72,
  },
  {
    id: "default-old-tbilisi-302",
    title: "ძველი თბილისის ჰიბრიდული ბინა #302 (Old Tbilisi Tourist/Student Unit)",
    city: "Old Tbilisi",
    address: "Betlemi St, Sololaki",
    image_url: null,
    listing_type: "hybrid",
    price_per_night: 80,
  },
  {
    id: "default-rustavi-401",
    title: "რუსთავის მუნიციპალური სივრცე #401 (Rustavi Central Smart Flat)",
    city: "Rustavi",
    address: "Kostava St, Rustavi",
    image_url: null,
    listing_type: "hybrid",
    price_per_night: 38,
  },
];

function HostPage() {
  const section = Route.useSearch({ select: (s) => s.section ?? "overview" });
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [syncs, setSyncs] = useState<ChannelSync[]>([]);
  const [tasks, setTasks] = useState<CleaningTask[]>([]);
  const [selectedProp, setSelectedProp] = useState<string>("all");
  const [pulse, setPulse] = useState<string | null>(null);

  // initial load — falls back to a curated Tbilisi/Rustavi catalog when the DB is empty
  useEffect(() => {
    (async () => {
      const [p, b, s, t] = await Promise.all([
        supabase.from("properties").select("*").order("created_at"),
        supabase.from("bookings").select("*").order("check_in"),
        supabase.from("channel_sync").select("*"),
        supabase.from("cleaning_tasks").select("*").order("scheduled_for"),
      ]);
      const dbProps = (p.data as Property[] | null) ?? [];
      setProperties(dbProps.length > 0 ? dbProps : DEFAULT_PROPERTIES);
      if (b.data) setBookings(b.data as Booking[]);
      if (s.data) setSyncs(s.data as ChannelSync[]);
      if (t.data) setTasks(t.data as CleaningTask[]);
    })();
  }, []);

  // realtime
  useEffect(() => {
    const channel = supabase
      .channel("host-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const nb = payload.new as Booking;
          setBookings((prev) => [...prev, nb].sort((a, b) => a.check_in.localeCompare(b.check_in)));
          setPulse(nb.id);
          setTimeout(() => setPulse(null), 2500);
          toast.success(`New booking: ${nb.guest_name ?? "Guest"} via ${CHANNEL_META[nb.channel]?.label ?? nb.channel}`);
        } else if (payload.eventType === "UPDATE") {
          const nb = payload.new as Booking;
          setBookings((prev) => prev.map((x) => (x.id === nb.id ? nb : x)));
        } else if (payload.eventType === "DELETE") {
          const old = payload.old as Booking;
          setBookings((prev) => prev.filter((x) => x.id !== old.id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "channel_sync" }, (payload) => {
        if (payload.eventType === "UPDATE") {
          const n = payload.new as ChannelSync;
          setSyncs((prev) => prev.map((s) => (s.id === n.id ? n : s)));
        } else if (payload.eventType === "INSERT") {
          setSyncs((prev) => [...prev, payload.new as ChannelSync]);
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "cleaning_tasks" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setTasks((prev) =>
            [...prev, payload.new as CleaningTask].sort((a, b) =>
              a.scheduled_for.localeCompare(b.scheduled_for),
            ),
          );
          toast.success("New cleaning task scheduled");
        } else if (payload.eventType === "UPDATE") {
          const n = payload.new as CleaningTask;
          setTasks((prev) => prev.map((t) => (t.id === n.id ? n : t)));
        } else if (payload.eventType === "DELETE") {
          const o = payload.old as CleaningTask;
          setTasks((prev) => prev.filter((t) => t.id !== o.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredBookings = useMemo(
    () =>
      selectedProp === "all" ? bookings : bookings.filter((b) => b.property_id === selectedProp),
    [bookings, selectedProp],
  );

  const upcomingBookings = filteredBookings.filter(
    (b) => new Date(b.check_out) >= new Date(new Date().toDateString()),
  );

  const occupancyRate = useMemo(() => {
    if (properties.length === 0) return 0;
    const next30 = 30 * properties.length;
    let nights = 0;
    const now = Date.now();
    const horizon = now + 30 * 86400000;
    for (const b of bookings) {
      if (b.status === "cancelled") continue;
      const ci = Math.max(new Date(b.check_in).getTime(), now);
      const co = Math.min(new Date(b.check_out).getTime(), horizon);
      if (co > ci) nights += Math.ceil((co - ci) / 86400000);
    }
    return Math.min(100, Math.round((nights / next30) * 100));
  }, [bookings, properties]);

  const visibleProps = selectedProp === "all" ? properties : properties.filter((p) => p.id === selectedProp);

  return (
    <HostShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Host control center</h1>
          <p className="text-muted-foreground">
            Unified calendar, channel sync, and cleaning ops — all live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedProp} onValueChange={setSelectedProp}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All properties</SelectItem>
              {properties.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <NewBookingDialog properties={properties} defaultProp={selectedProp} />
        </div>
      </div>

      {section === "overview" && (
        <div className="space-y-6">
          <HeroAnalytics
            occupancy={occupancyRate}
            revenue={bookings
              .filter((b) => b.status !== "cancelled" && b.total_price)
              .reduce((s, b) => s + Number(b.total_price ?? 0), 0)}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard label="Properties" value={properties.length} icon={<MapPin className="h-4 w-4" />} />
            <StatCard
              label="Active bookings"
              value={upcomingBookings.length}
              icon={<CalendarDays className="h-4 w-4" />}
            />
            <StatCard
              label="Occupancy (30d)"
              value={`${occupancyRate}%`}
              icon={<Radio className="h-4 w-4" />}
            />
            <StatCard
              label="Cleaning queue"
              value={tasks.filter((t) => t.status !== "completed").length}
              icon={<Sparkles className="h-4 w-4" />}
            />
          </div>

          <SmartRentPredictor />
          <AirbnbPriorityToggle />
          <DemandMap />

          {properties[0] && (
            <SmartContractCard
              propertyTitle={properties[0].title}
              district={properties[0].city ?? "Tbilisi"}
              monthlyRent={Number(properties[0].price_per_night ?? 1500)}
              tenantName="Nino K."
              hostName="You"
            />
          )}
        </div>
      )}

      {section === "calendar" && (
        <CalendarView properties={visibleProps} bookings={filteredBookings} pulse={pulse} />
      )}

      {section === "channels" && <ChannelsView properties={properties} syncs={syncs} />}

      {section === "applicants" && <TenantScreeningView properties={visibleProps} />}

      {section === "operations" && (
        <OpsView
          properties={properties}
          tasks={tasks}
          bookings={filteredBookings}
          filteredPropId={selectedProp === "all" ? null : selectedProp}
        />
      )}
    </HostShell>
  );
}

function StatCard({ label, value, icon }: { label: string; value: number | string; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="font-display text-2xl font-bold">{value}</div>
        </div>
        <div className="rounded-md bg-primary/10 p-2 text-primary">{icon}</div>
      </CardContent>
    </Card>
  );
}

function HeroAnalytics({ occupancy, revenue }: { occupancy: number; revenue: number }) {
  // Student-discount-first AI recommendations (no host promos / corporate booking deals).
  const lowOccupancy = occupancy < 50;
  const tipIcon = lowOccupancy ? (
    <AlertTriangle className="w-5 h-5 text-warning" />
  ) : (
    <TrendingUp className="w-5 h-5 text-accent" />
  );
  const tipText = lowOccupancy
    ? "დაბალი დატვირთულობა. ჩართეთ 15%-იანი სტუდენტური ფასდაკლება SakhliAI-ზე გრძელვადიანი მდგმურის სწრაფად საპოვნელად / Low occupancy. Activate a 15% Student Discount on SakhliAI to secure a long-term tenant immediately."
    : "რეკომენდაცია: Airbnb პრიორიტეტი (Airbnb Priority). გადართეთ მოკლევადიან გაქირავებაზე ტურისტული სეზონის პიკისას შემოსავლის 2.5x-ით გასაზრდელად / Recommendation: Switch to Airbnb Priority during active short-term tourist windows to maximize hybrid yield.";

  return (
    <div className="mb-4 grid gap-4 md:grid-cols-3">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Occupancy Rate · დაკავებულობა
          </div>
          <div className="mt-1 font-display text-3xl font-bold text-gradient">{occupancy}%</div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${occupancy}%` }} />
          </div>
        </CardContent>
      </Card>
      <Card className="border-primary/20">
        <CardContent className="p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Monthly Revenue · ყოველთვიური შემოსავალი
          </div>
          <div className="mt-1 font-display text-3xl font-bold">
            {revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })} GEL
          </div>
          <div className="mt-2 text-xs text-muted-foreground">across all channels</div>
        </CardContent>
      </Card>
      <Card
        className={`border-accent/30 bg-gradient-to-br ${
          lowOccupancy ? "from-warning/10" : "from-accent/10"
        } to-transparent`}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" /> AI Optimization · რჩევა
          </div>
          <div className="mt-2 flex items-start gap-2 text-sm font-medium leading-snug">
            <span className="mt-0.5 shrink-0">{tipIcon}</span>
            <span>{tipText}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// -------------------- AIRBNB PRIORITY TOGGLE --------------------
function AirbnbPriorityToggle() {
  const [active, setActive] = useState(false);

  const onToggle = (v: boolean) => {
    setActive(v);
    if (v) {
      toast.success(
        "სისტემა გადავიდა მოკლევადიან ტურისტულ რეჟიმზე. კალენდარი სინქრონიზებულია n8n-ის მიერ / System shifted to short-term tourist optimization. Calendar synchronized via n8n backend.",
        { duration: 4500 },
      );
    } else {
      toast("Airbnb Priority disabled — reverted to hybrid student-first balance.");
    }
  };

  return (
    <Card
      className={`mb-6 border-2 transition-colors ${
        active
          ? "border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-transparent"
          : "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent"
      }`}
    >
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-rose-500/15 p-2 text-rose-500">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold">
              Airbnb პრიორიტეტი / Airbnb Priority
            </div>
            <div className="text-xs text-muted-foreground">
              Tourist-season override — pushes Airbnb / Booking calendars to the top of the n8n
              sync queue.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              Synced via n8n
            </span>
          )}
          <Switch checked={active} onCheckedChange={onToggle} aria-label="Toggle Airbnb Priority" />
        </div>
      </CardContent>
      {active && (
        <CardContent className="border-t border-emerald-500/20 bg-emerald-500/5 px-5 py-3 text-xs text-emerald-800 dark:text-emerald-200">
          ✅ სისტემა გადავიდა მოკლევადიან ტურისტულ რეჟიმზე. კალენდარი სინქრონიზებულია n8n-ის მიერ /
          System shifted to short-term tourist optimization. Calendar synchronized via n8n backend.
        </CardContent>
      )}
    </Card>
  );
}

// -------------------- CALENDAR --------------------
function CalendarView({
  properties,
  bookings,
  pulse,
}: {
  properties: Property[];
  bookings: Booking[];
  pulse: string | null;
}) {
  // 30-day horizon starting today
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, []);

  if (properties.length === 0) {
    return <Card><CardContent className="p-8 text-center text-muted-foreground">No properties yet.</CardContent></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unified live calendar</CardTitle>
        <CardDescription>
          Bookings from every channel, in one view. Updates the moment a new reservation lands.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="min-w-[900px]">
          {/* header */}
          <div
            className="grid gap-px border-b text-xs"
            style={{ gridTemplateColumns: `200px repeat(${days.length}, minmax(28px,1fr))` }}
          >
            <div className="px-2 py-2 font-medium">Property</div>
            {days.map((d) => (
              <div
                key={d.toISOString()}
                className={`px-1 py-2 text-center ${
                  d.getDay() === 0 || d.getDay() === 6 ? "text-muted-foreground" : ""
                }`}
              >
                <div className="font-semibold">{d.getDate()}</div>
                <div className="text-[10px] uppercase opacity-60">
                  {d.toLocaleDateString("en", { month: "short" })}
                </div>
              </div>
            ))}
          </div>

          {properties.map((p) => {
            const propBookings = bookings.filter((b) => b.property_id === p.id);
            return (
              <div
                key={p.id}
                className="relative grid gap-px border-b last:border-b-0"
                style={{ gridTemplateColumns: `200px repeat(${days.length}, minmax(28px,1fr))` }}
              >
                <div className="flex items-center gap-2 px-2 py-3">
                  <div
                    className="h-8 w-8 shrink-0 rounded bg-cover bg-center bg-muted"
                    style={{ backgroundImage: p.image_url ? `url(${p.image_url})` : undefined }}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{p.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{p.city}</div>
                  </div>
                </div>
                {days.map((d) => (
                  <div
                    key={d.toISOString()}
                    className={`relative h-14 border-l border-border/40 ${
                      d.getDay() === 0 || d.getDay() === 6 ? "bg-muted/30" : ""
                    }`}
                  />
                ))}

                {/* booking bars */}
                {propBookings.map((b) => {
                  const start = new Date(b.check_in);
                  const end = new Date(b.check_out);
                  start.setHours(0, 0, 0, 0);
                  end.setHours(0, 0, 0, 0);
                  const first = days[0];
                  const last = days[days.length - 1];
                  if (end < first || start > last) return null;
                  const startIdx = Math.max(0, Math.round((+start - +first) / 86400000));
                  const endIdx = Math.min(days.length - 1, Math.round((+end - +first) / 86400000));
                  const span = endIdx - startIdx;
                  if (span <= 0) return null;
                  const meta = CHANNEL_META[b.channel] ?? CHANNEL_META.direct;
                  const isPulse = pulse === b.id;
                  return (
                    <HoverCard key={b.id} openDelay={80}>
                      <HoverCardTrigger asChild>
                        <div
                          className={`absolute top-2 z-10 flex h-10 cursor-pointer items-center gap-1.5 overflow-hidden rounded-md px-2 text-xs font-medium text-white shadow-sm ${meta.color} ${
                            isPulse ? "ring-2 ring-offset-2 ring-primary animate-pulse" : ""
                          }`}
                          style={{
                            left: `calc(200px + (100% - 200px) * ${startIdx} / ${days.length})`,
                            width: `calc((100% - 200px) * ${span} / ${days.length} - 4px)`,
                          }}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[10px] font-bold ${meta.logoColor}`}>
                            {meta.logo}
                          </span>
                          <span className="truncate">{b.guest_name ?? "Guest"}</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-72" align="start">
                        <div className="flex items-center gap-2">
                          <span className={`flex h-7 w-7 items-center justify-center rounded ${meta.color} text-xs font-bold text-white`}>
                            {meta.logo}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{b.guest_name ?? "Guest"}</div>
                            <div className="text-xs text-muted-foreground">via {meta.label}</div>
                          </div>
                          <Badge variant="secondary" className="ml-auto text-[10px] capitalize">
                            {b.status}
                          </Badge>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-muted-foreground">Check-in</div>
                            <div className="font-medium">{b.check_in}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Check-out</div>
                            <div className="font-medium">{b.check_out}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Guests</div>
                            <div className="font-medium">{b.guests_count ?? 1}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Payment</div>
                            <div className="font-medium">
                              {b.total_price ? `₾ ${Number(b.total_price).toLocaleString()} · Paid` : "Pending"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1.5 text-[11px] text-accent-foreground">
                          <Sparkles className="h-3 w-3 text-accent" />
                          Synchronized instantly via n8n backend
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(CHANNEL_META).map(([k, m]) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={`h-3 w-3 rounded ${m.color}`} />
              {m.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- ICAL CONFIG DIALOG --------------------
function ConfigureIcalDialog({
  sync,
  channel,
  onSave,
}: {
  sync?: ChannelSync;
  channel: string;
  onSave: (icalUrl: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(sync?.ical_url ?? "");

  // Update URL if sync prop changes
  useEffect(() => {
    if (sync?.ical_url) {
      setUrl(sync.ical_url);
    }
  }, [sync]);

  const handleSave = () => {
    onSave(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Configure iCal Feed">
          <Link2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure {channel.toUpperCase()} iCal Feed</DialogTitle>
          <DialogDescription>
            Enter the iCal (ICS) calendar link from {channel === "airbnb" ? "Airbnb" : channel === "booking" ? "Booking.com" : channel} to automatically import bookings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ical-url">iCal Feed URL</Label>
            <Input
              id="ical-url"
              placeholder="https://www.airbnb.com/calendar/ical/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Config</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// -------------------- CHANNELS --------------------
function ChannelsView({ properties, syncs }: { properties: Property[]; syncs: ChannelSync[] }) {
  const channels = ["airbnb", "booking", "sakliai", "student"] as const;

  const handleSaveIcal = async (propertyId: string, channel: string, url: string, current?: ChannelSync) => {
    if (current) {
      await supabase
        .from("channel_sync")
        .update({ ical_url: url, enabled: true, status: "synced", last_synced_at: new Date().toISOString() })
        .eq("id", current.id);
    } else {
      await supabase
        .from("channel_sync")
        .insert({
          property_id: propertyId,
          channel,
          enabled: true,
          ical_url: url,
          status: "synced",
          last_synced_at: new Date().toISOString(),
        });
    }
    toast.success("iCal link saved & calendar sync completed!");
  };

  const toggle = async (propertyId: string, channel: string, current?: ChannelSync) => {
    if (current) {
      await supabase
        .from("channel_sync")
        .update({ enabled: !current.enabled, status: !current.enabled ? "syncing" : "idle" })
        .eq("id", current.id);
      if (!current.enabled) {
        // simulate sync completion
        setTimeout(async () => {
          await supabase
            .from("channel_sync")
            .update({ status: "synced", last_synced_at: new Date().toISOString() })
            .eq("id", current.id);
        }, 1200);
      }
    } else {
      const { data } = await supabase
        .from("channel_sync")
        .insert({ property_id: propertyId, channel, enabled: true, status: "syncing" })
        .select()
        .single();
      if (data) {
        setTimeout(async () => {
          await supabase
            .from("channel_sync")
            .update({ status: "synced", last_synced_at: new Date().toISOString() })
            .eq("id", data.id);
        }, 1200);
      }
    }
  };

  const resync = async (s: ChannelSync) => {
    await supabase.from("channel_sync").update({ status: "syncing" }).eq("id", s.id);
    setTimeout(async () => {
      await supabase
        .from("channel_sync")
        .update({ status: "synced", last_synced_at: new Date().toISOString() })
        .eq("id", s.id);
    }, 1000);
  };

  return (
    <div className="grid gap-4">
      {properties.map((p) => (
        <Card key={p.id}>
          <CardHeader>
            <CardTitle className="text-base">{p.title}</CardTitle>
            <CardDescription>{p.city}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {channels.map((ch) => {
                const s = syncs.find((x) => x.property_id === p.id && x.channel === ch);
                const meta = CHANNEL_META[ch];
                return (
                  <div key={ch} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <span className={`h-8 w-8 rounded ${meta.color}`} />
                      <div>
                        <div className="text-sm font-medium">{meta.label}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <StatusDot status={s?.status ?? "idle"} />
                          {s?.last_synced_at
                            ? `Synced ${timeAgo(s.last_synced_at)}`
                            : "Not connected"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConfigureIcalDialog
                        sync={s}
                        channel={ch}
                        onSave={(url) => handleSaveIcal(p.id, ch, url, s)}
                      />
                      {s?.enabled && s.status === "synced" && (
                        <Button size="sm" variant="ghost" onClick={() => resync(s)}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Switch checked={!!s?.enabled} onCheckedChange={() => toggle(p.id, ch, s)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "synced"
      ? "bg-emerald-500"
      : status === "syncing"
        ? "bg-amber-500 animate-pulse"
        : status === "error"
          ? "bg-destructive"
          : "bg-muted-foreground/40";
  return <span className={`inline-block h-2 w-2 rounded-full ${color}`} />;
}

// -------------------- OPS --------------------
function OpsView({
  properties,
  tasks,
  bookings,
  filteredPropId,
}: {
  properties: Property[];
  tasks: CleaningTask[];
  bookings: Booking[];
  filteredPropId: string | null;
}) {
  const list = filteredPropId ? tasks.filter((t) => t.property_id === filteredPropId) : tasks;

  const advance = async (t: CleaningTask) => {
    const next: Record<string, string> = {
      pending: "assigned",
      assigned: "in_progress",
      in_progress: "completed",
      completed: "completed",
    };
    await supabase.from("cleaning_tasks").update({ status: next[t.status] ?? "completed" }).eq("id", t.id);
  };

  return (
    <div className="space-y-4">
      <SmartAccess properties={properties} bookings={bookings} filteredPropId={filteredPropId} />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Cleaning operations hub</CardTitle>
            <CardDescription>
              Auto-created on checkout. n8n dispatches SMS / WhatsApp to the assigned cleaner.
            </CardDescription>
          </div>
          <NewTaskDialog properties={properties} defaultProp={filteredPropId} />
        </CardHeader>
        <CardContent className="space-y-2">
          {list.length === 0 && (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              No cleaning tasks yet. They appear automatically when a booking ends.
            </div>
          )}
          {list.map((t) => {
            const prop = properties.find((p) => p.id === t.property_id);
            return (
              <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-md border p-3">
                <StatusBadge status={t.status} />
                <div className="min-w-[160px]">
                  <div className="text-sm font-medium">{prop?.title ?? "Property"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.scheduled_for).toLocaleString("en", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  {t.cleaner_name ?? "Unassigned"}
                  {t.cleaner_phone && (
                    <a href={`tel:${t.cleaner_phone}`} className="flex items-center gap-1 text-xs text-primary">
                      <Phone className="h-3 w-3" /> {t.cleaner_phone}
                    </a>
                  )}
                </div>
                {t.notes && <div className="text-xs text-muted-foreground">{t.notes}</div>}
                <div className="ml-auto">
                  {t.status !== "completed" && (
                    <Button size="sm" variant="outline" onClick={() => advance(t)}>
                      Mark {t.status === "pending" ? "assigned" : t.status === "assigned" ? "in progress" : "complete"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function SmartAccess({
  properties,
  bookings,
  filteredPropId,
}: {
  properties: Property[];
  bookings: Booking[];
  filteredPropId: string | null;
}) {
  const todayMs = Date.now();
  const active = useMemo(
    () =>
      bookings
        .filter((b) => b.status !== "cancelled")
        .filter((b) => {
          const inMs = new Date(b.check_in).getTime();
          const outMs = new Date(b.check_out).getTime();
          // active or upcoming within 48h
          return outMs >= todayMs && inMs <= todayMs + 2 * 86400000;
        })
        .filter((b) => (filteredPropId ? b.property_id === filteredPropId : true))
        .sort((a, b) => a.check_in.localeCompare(b.check_in))[0] ?? null,
    [bookings, filteredPropId, todayMs],
  );

  const property = active ? properties.find((p) => p.id === active.property_id) : null;

  const [code, setCode] = useState(() => genCode());
  const [regenAt, setRegenAt] = useState<Date>(() => new Date());

  function genCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  const regenerate = () => {
    setCode(genCode());
    setRegenAt(new Date());
    toast.success("Smart lock code regenerated — n8n would now SMS it to the guest.");
  };

  const payload = active
    ? `SAKHLIAI|${active.id.slice(0, 8)}|${property?.title ?? "Unit"}|CODE:${code}|CI:${active.check_in}`
    : `SAKHLIAI|DEMO|CODE:${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(payload)}`;

  return (
    <Card className="border-accent/30">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Smart Access · ჭკვიანი საკეტი
          </CardTitle>
          <CardDescription>
            Dynamic QR + lockbox code for the active booking. n8n rotates this at 03:00 for late-night check-ins.
          </CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={regenerate}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Regenerate Code
        </Button>
      </CardHeader>
      <CardContent>
        {active ? (
          <div className="grid items-center gap-5 md:grid-cols-[180px_1fr]">
            <div className="flex justify-center rounded-lg border border-border bg-white p-3">
              <img src={qrUrl} alt="Smart access QR" width={180} height={180} />
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Guest</div>
                <div className="font-medium">{active.guest_name ?? "Guest"} · {property?.title}</div>
                <div className="text-xs text-muted-foreground">
                  {active.check_in} → {active.check_out}
                </div>
              </div>
              <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Lockbox code</div>
                <div className="font-display text-4xl font-bold tracking-[0.3em] text-gradient">
                  {code}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Generated {regenAt.toLocaleTimeString()} · auto-expires at next check-out
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Tip: n8n cron at 03:00 calls <code>/api/public/n8n/booking</code> to refresh codes for arrivals.
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No active booking. A code will be generated automatically when a guest is within 48 hours of check-in.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    pending: { label: "Pending", icon: <Clock className="h-3 w-3" />, cls: "bg-muted text-foreground" },
    assigned: { label: "Assigned", icon: <Clock className="h-3 w-3" />, cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
    in_progress: { label: "In progress", icon: <RefreshCw className="h-3 w-3" />, cls: "bg-primary/15 text-primary" },
    completed: { label: "Done", icon: <CheckCircle2 className="h-3 w-3" />, cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
    cancelled: { label: "Cancelled", icon: <AlertCircle className="h-3 w-3" />, cls: "bg-destructive/15 text-destructive" },
  };
  const m = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${m.cls}`}>
      {m.icon}
      {m.label}
    </span>
  );
}

// -------------------- DIALOGS --------------------
function NewBookingDialog({ properties, defaultProp }: { properties: Property[]; defaultProp: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    property_id: defaultProp !== "all" ? defaultProp : "",
    guest_name: "",
    channel: "direct",
    check_in: "",
    check_out: "",
    total_price: "",
  });

  useEffect(() => {
    if (defaultProp !== "all") setForm((f) => ({ ...f, property_id: defaultProp }));
  }, [defaultProp]);

  const submit = async () => {
    if (!form.property_id || !form.check_in || !form.check_out) {
      toast.error("Property and dates are required");
      return;
    }
    const { error } = await supabase.from("bookings").insert({
      property_id: form.property_id,
      guest_name: form.guest_name || "Guest",
      channel: form.channel,
      booking_type: form.channel === "student" ? "student" : "short_term",
      check_in: form.check_in,
      check_out: form.check_out,
      total_price: form.total_price ? Number(form.total_price) : null,
      status: "confirmed",
    });
    if (error) toast.error(error.message);
    else {
      setOpen(false);
      setForm({ ...form, guest_name: "", check_in: "", check_out: "", total_price: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1 h-4 w-4" /> New booking
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add booking</DialogTitle>
          <DialogDescription>
            Insert a booking — the calendar updates in real-time across every open session.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Property</Label>
            <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
              <SelectTrigger><SelectValue placeholder="Choose property" /></SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Guest name</Label>
              <Input value={form.guest_name} onChange={(e) => setForm({ ...form, guest_name: e.target.value })} />
            </div>
            <div>
              <Label>Channel</Label>
              <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(CHANNEL_META).map(([k, m]) => (
                    <SelectItem key={k} value={k}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Check-in</Label>
              <Input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} />
            </div>
            <div>
              <Label>Check-out</Label>
              <Input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Total price (GEL)</Label>
            <Input type="number" value={form.total_price} onChange={(e) => setForm({ ...form, total_price: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewTaskDialog({ properties, defaultProp }: { properties: Property[]; defaultProp: string | null }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    property_id: defaultProp ?? "",
    cleaner_name: "",
    cleaner_phone: "",
    scheduled_for: "",
    notes: "",
  });

  useEffect(() => {
    if (defaultProp) setForm((f) => ({ ...f, property_id: defaultProp }));
  }, [defaultProp]);

  const submit = async () => {
    if (!form.property_id || !form.scheduled_for) {
      toast.error("Property and time required");
      return;
    }
    const { error } = await supabase.from("cleaning_tasks").insert({
      property_id: form.property_id,
      cleaner_name: form.cleaner_name || null,
      cleaner_phone: form.cleaner_phone || null,
      scheduled_for: form.scheduled_for,
      notes: form.notes || null,
      status: form.cleaner_name ? "assigned" : "pending",
    });
    if (error) toast.error(error.message);
    else {
      setOpen(false);
      setForm({ ...form, cleaner_name: "", cleaner_phone: "", scheduled_for: "", notes: "" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-1 h-4 w-4" /> Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New cleaning task</DialogTitle>
          <DialogDescription>Assign a cleaner. n8n will send the SMS.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Property</Label>
            <Select value={form.property_id} onValueChange={(v) => setForm({ ...form, property_id: v })}>
              <SelectTrigger><SelectValue placeholder="Property" /></SelectTrigger>
              <SelectContent>
                {properties.map((p) => (<SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Cleaner name</Label>
              <Input value={form.cleaner_name} onChange={(e) => setForm({ ...form, cleaner_name: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.cleaner_phone} onChange={(e) => setForm({ ...form, cleaner_phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>When</Label>
            <Input type="datetime-local" value={form.scheduled_for} onChange={(e) => setForm({ ...form, scheduled_for: e.target.value })} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// -------------------- AI SMART RENT PREDICTOR --------------------
const RENT_AMENITIES = ["Wi-Fi", "AC", "Washer", "Parking", "Balcony", "Heating"] as const;
type RentAmenity = (typeof RENT_AMENITIES)[number];

const LOCATION_MULT: Record<string, { mult: number; touristMult: number; labelKa: string }> = {
  Vake: { mult: 1.25, touristMult: 1.35, labelKa: "ვაკე" },
  Saburtalo: { mult: 1.0, touristMult: 1.0, labelKa: "საბურთალო" },
  "Old Tbilisi": { mult: 1.15, touristMult: 1.5, labelKa: "ძველი თბილისი" },
  Saulo: { mult: 0.85, touristMult: 0.8, labelKa: "სოლოლაკი" },
  Batumi: { mult: 0.95, touristMult: 1.4, labelKa: "ბათუმი" },
};

function SmartRentPredictor() {
  const [location, setLocation] = useState<keyof typeof LOCATION_MULT>("Saburtalo");
  const [sqm, setSqm] = useState(65);
  const [amenities, setAmenities] = useState<RentAmenity[]>(["Wi-Fi", "AC", "Washer"]);

  const cfg = LOCATION_MULT[location];
  const amenityBoost = 1 + amenities.length * 0.04;
  const baseMonth = 14 * sqm; // 14 GEL per sqm baseline
  const studentMonth = Math.round((baseMonth * cfg.mult * amenityBoost) / 10) * 10;
  const tourismNight = Math.round((baseMonth * cfg.touristMult * amenityBoost) / 30 / 5) * 5;

  const toggle = (a: RentAmenity) =>
    setAmenities((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));

  return (
    <Card className="mb-6 border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" />
          AI Smart Rent Predictor · ქირის პროგნოზირების AI კალკულატორი
        </CardTitle>
        <CardDescription>
          Enter property details — SakhliAI compares Tbilisi market data to recommend split-season pricing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 md:grid-cols-[1fr_1fr_1.1fr]">
          {/* Inputs */}
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Location · ლოკაცია</Label>
              <Select value={location} onValueChange={(v) => setLocation(v as keyof typeof LOCATION_MULT)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(LOCATION_MULT).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {k} · {v.labelKa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Size · ფართობი (m²)</Label>
              <Input
                type="number"
                value={sqm}
                min={20}
                max={300}
                onChange={(e) => setSqm(Math.max(20, Number(e.target.value) || 0))}
              />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <Label className="text-xs">Amenities · კეთილმოწყობა</Label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {RENT_AMENITIES.map((a) => {
                const on = amenities.includes(a);
                return (
                  <label
                    key={a}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-xs transition-colors ${
                      on ? "border-accent bg-accent/10" : "border-border bg-card"
                    }`}
                  >
                    <Checkbox checked={on} onCheckedChange={() => toggle(a)} />
                    {a}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Recommendation */}
          <div className="space-y-3">
            <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 to-primary/5 p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                სასწავლო სეზონი (სტუდენტები) · Academic Season
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-gradient">
                {studentMonth.toLocaleString()} GEL<span className="text-sm font-medium text-muted-foreground">/თვე · /month</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">9-month long-term lease</div>
            </div>
            <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/15 to-accent/5 p-4">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                ტურისტული სეზონი (მოკლევადიანი) · Tourist Season
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-gradient">
                {tourismNight.toLocaleString()} GEL<span className="text-sm font-medium text-muted-foreground">/დღე · /night</span>
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">June–September peak demand</div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-md border border-accent/20 bg-accent/5 p-3 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 text-accent" />
          Hybrid model: switch between student tenants in academic months and short-term tourists in summer to maximize yearly revenue.
        </div>
      </CardContent>
    </Card>
  );
}

// -------------------- TENANT SCREENING --------------------
type Applicant = {
  id: string;
  name: string | null;
  university: string | null;
  salary_bracket: string | null;
  income_source: string | null;
  sleep: string | null;
  smoking: boolean | null;
  pets: boolean | null;
  parties: boolean | null;
  quiet: boolean | null;
  cleanliness: number | null;
  budget: number | null;
  bio: string | null;
  city: string | null;
  created_at: string;
};

function TenantScreeningView({ properties }: { properties: Property[] }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("student_profiles")
        .select(
          "id, name, university, salary_bracket, income_source, sleep, smoking, pets, parties, quiet, cleanliness, budget, bio, city, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) console.error("[TenantScreening] fetch error:", error.message);
      if (data) setApplicants(data as Applicant[]);
      setLoading(false);
    })();

    const ch = supabase
      .channel("applicants-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "student_profiles" }, (payload) => {
        setApplicants((prev) => [payload.new as Applicant, ...prev]);
        toast.success("New tenant application received");
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const refPrice = properties[0]?.price_per_night ? Number(properties[0].price_per_night) * 30 : 1600;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-accent" /> Tenant Screening · მდგმურის შემოწმება
        </CardTitle>
        <CardDescription>
          Live applicant pool from <code>student_profiles</code>. Each card carries an AI risk / fit analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && <div className="text-sm text-muted-foreground">Loading applicants…</div>}
        {!loading && applicants.length === 0 && (
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No applications yet. New student profiles appear here in real-time.
          </div>
        )}
        {applicants.map((a) => (
          <ApplicantRow key={a.id} a={a} refPrice={refPrice} />
        ))}
      </CardContent>
    </Card>
  );
}

function ApplicantRow({ a, refPrice }: { a: Applicant; refPrice: number }) {
  const screening = screenApplicant(a, refPrice);
  const verdictClasses =
    screening.verdict === "ideal"
      ? "border-emerald-500/40 bg-emerald-500/5"
      : screening.verdict === "good"
        ? "border-primary/30 bg-primary/5"
        : "border-amber-500/40 bg-amber-500/5";
  const churnClasses =
    screening.churnRisk === "დაბალი"
      ? "text-emerald-600 dark:text-emerald-400"
      : screening.churnRisk === "საშუალო"
        ? "text-amber-600 dark:text-amber-400"
        : "text-destructive";

  return (
    <div className={`grid gap-3 rounded-xl border p-4 sm:grid-cols-[1fr_1.4fr] ${verdictClasses}`}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="font-display text-lg font-bold">{a.name ?? "Anonymous"}</div>
          <Badge variant="secondary" className="text-[10px] uppercase">
            {screening.verdict === "ideal" ? "Ideal" : screening.verdict === "good" ? "Good" : "Review"}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <GraduationCap className="h-3.5 w-3.5" /> {a.university ?? "—"}
        </div>
        <div className="flex flex-wrap gap-1 text-[11px]">
          <span className="rounded-full bg-card px-2 py-0.5">
            ₾{a.budget ?? 0}
          </span>
          <span className="rounded-full bg-card px-2 py-0.5">{a.income_source ?? "—"}</span>
          <span className="rounded-full bg-card px-2 py-0.5">
            🧹 {a.cleanliness ?? 3}/5
          </span>
          <span className="rounded-full bg-card px-2 py-0.5">
            {a.smoking ? "🚬 ეწევა" : "🚭 არ ეწევა"}
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-3 text-sm">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> AI Risk / Fit Analysis
          </div>
          <div className="font-display text-lg font-bold">{screening.score}%</div>
        </div>
        <p className="leading-snug text-foreground">{screening.summary}</p>
        <div className="mt-2 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">Churn Risk</span>
          <span className={`font-semibold uppercase tracking-wide ${churnClasses}`}>
            {screening.churnRisk}
          </span>
        </div>
      </div>
    </div>
  );
}
