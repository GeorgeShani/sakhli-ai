import { Bike, Bus, Footprints, GraduationCap } from "lucide-react";

const UNI_HUBS: Record<string, { walk: number; metro: number; bus: number; hub: string }> = {
  "Tbilisi State University": { walk: 12, metro: 2, bus: 4, hub: "თსუ მაღლივი" },
  "Ilia State University": { walk: 25, metro: 3, bus: 6, hub: "ილიაუნი" },
  "Free University": { walk: 35, metro: 5, bus: 9, hub: "Freeuni კამპუსი" },
  "Georgian Technical University": { walk: 18, metro: 2, bus: 5, hub: "GTU" },
  "Business and Technology University": { walk: 22, metro: 3, bus: 7, hub: "BTU" },
};

function pickHub(uni?: string, district?: string) {
  const base = (uni ? UNI_HUBS[uni] : undefined) ?? { walk: 20, metro: 3, bus: 5, hub: uni ?? "კამპუსი" };
  // distance scaling by district
  const f =
    district === "Saburtalo" ? 0.7 : district === "Vake" ? 1 : district === "Old Tbilisi" ? 1.2 : 1.4;
  return {
    hub: base.hub,
    walk: Math.round(base.walk * f),
    metro: Math.max(1, Math.round(base.metro * f)),
    bus: Math.max(2, Math.round(base.bus * f)),
  };
}

export function CommuteWidget({ university, district }: { university?: string; district?: string }) {
  const c = pickHub(university, district);
  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
        <GraduationCap className="h-3.5 w-3.5" /> Commute & Campus Fit · ტრანსპორტი {c.hub}-მდე
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        <Metric icon={<Footprints className="h-3.5 w-3.5" />} label="ფეხით / walk" value={`${c.walk} წთ`} />
        <Metric icon={<Bus className="h-3.5 w-3.5" />} label="მეტრო · ${c.metro}" value={`${c.metro} გაჩერ.`} />
        <Metric icon={<Bike className="h-3.5 w-3.5" />} label="ავტობუსი / bus" value={`${c.bus} წთ`} />
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md bg-card p-2">
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">{icon} {label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  );
}
