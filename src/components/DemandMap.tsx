import { useState } from "react";
import { MapPin, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Zone = {
  id: string;
  name: string;
  nameKa: string;
  x: number;
  y: number;
  heat: number; // 0-100
  recommendedPrice: number;
  insight: string;
  insightKa: string;
};

const ZONES: Zone[] = [
  {
    id: "vake",
    name: "Vake",
    nameKa: "ვაკე",
    x: 30,
    y: 45,
    heat: 92,
    recommendedPrice: 1750,
    insight: "Vake demand is exceptionally high due to the density of international universities and students. Suggested price: 1,750 GEL.",
    insightKa: "ვაკეში მოთხოვნა მაღალია უცხოელი სტუდენტების გამო. რეკომენდებული ფასი: 1,750 GEL.",
  },
  {
    id: "saburtalo",
    name: "Saburtalo",
    nameKa: "საბურთალო",
    x: 50,
    y: 40,
    heat: 86,
    recommendedPrice: 1400,
    insight: "Saburtalo student demand is up 14% as a direct result of the new metro station and high density of private campuses.",
    insightKa: "საბურთალოზე სტუდენტური მოთხოვნა +14% — ახალი მეტრო სადგურის ეფექტი.",
  },
  {
    id: "oldtbilisi",
    name: "Old Tbilisi",
    nameKa: "ძველი თბილისი",
    x: 55,
    y: 60,
    heat: 78,
    recommendedPrice: 1900,
    insight: "Old Tbilisi tourist zone sees premium short-term demand up 22%. We suggest prioritization of SakhliAI hybrid rental leases.",
    insightKa: "ძველი თბილისი — მოკლევადიანი დაჯავშნებისთვის +22%. რეკომენდაცია: Airbnb პრიორიტეტი.",
  },
  {
    id: "rustavi",
    name: "Rustavi Center",
    nameKa: "რუსთავი",
    x: 80,
    y: 75,
    heat: 65,
    recommendedPrice: 600,
    insight: "Rustavi student demand has increased 18% due to affordable inter-city transport. Recommended price: 600 GEL.",
    insightKa: "რუსთავში სტუდენტური მოთხოვნა 18%-ით გაიზარდა ტრანსპორტის გამო. რეკომენდებული ფასი: 600 GEL.",
  },
];

function heatColor(h: number) {
  if (h >= 85) return "bg-red-500 shadow-[0_0_25px_rgba(239,68,68,0.7)]";
  if (h >= 70) return "bg-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.6)]";
  return "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]";
}

export function DemandMap() {
  const [active, setActive] = useState<Zone | null>(null);
  const { locale } = useI18n();
  const isKa = locale === "ka";

  return (
    <div className="card-elevated p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-primary">
            <TrendingUp className="h-3.5 w-3.5" /> 
            {isKa ? "მოთხოვნის რუკა" : "Interactive Demand Map"}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">
            {isKa ? "თბილისი & რეგიონები" : "Tbilisi & Regions"}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> High</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Med</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Low</span>
        </div>
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        {/* Decorative map grid */}
        <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* River outline */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 0 55 Q 30 50 50 60 T 100 65" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" fill="none" />
        </svg>

        {ZONES.map((z) => (
          <button
            key={z.id}
            onClick={() => setActive(z)}
            style={{ left: `${z.x}%`, top: `${z.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 group"
          >
            <span className={`block h-5 w-5 animate-pulse rounded-full ${heatColor(z.heat)}`} />
            <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold text-foreground/80 group-hover:text-foreground">
              {isKa ? z.nameKa : z.name}
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div className="mt-3 animate-fade-in rounded-lg border border-accent/40 bg-gradient-to-br from-accent/10 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-display text-base font-semibold">
              <MapPin className="h-4 w-4 text-accent" /> {isKa ? active.nameKa : active.name}
            </div>
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-600 dark:text-red-400">
              Heat {active.heat}/100
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isKa ? active.insightKa : active.insight}
          </p>
          <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            💰 AI Suggested: ₾{active.recommendedPrice.toLocaleString()} / month
          </div>
        </div>
      )}
    </div>
  );
}
