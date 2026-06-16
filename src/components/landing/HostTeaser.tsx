import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, CalendarRange, KeyRound, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

const PILLS = [
  { Icon: CalendarRange, label: "Unified calendar" },
  { Icon: TrendingUp, label: "AI rent pricing" },
  { Icon: KeyRound, label: "Smart-lock codes" },
];

export function HostTeaser() {
  const { t } = useI18n();
  return (
    <section id="hosts" className="mx-auto max-w-6xl px-4 py-20 md:py-24">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface to-card p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <Building2 className="h-3.5 w-3.5 text-accent" />
                {t("land.host.tag")}
              </div>
              <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
                {t("land.host.title")}
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">{t("land.host.desc")}</p>
              <Button asChild size="lg" className="mt-6 h-12 px-6">
                <Link to="/role-select" search={{ role: "host" }}>
                  {t("land.host.cta")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {PILLS.map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/15 text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
