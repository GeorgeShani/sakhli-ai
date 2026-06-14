import { Workflow, Zap } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { useAgentFeed } from "@/lib/agent-events";
import { AgentActivityFeed } from "@/components/agent/AgentActivityFeed";

export function AutomationStory() {
  const { t, locale } = useI18n();
  const { events } = useAgentFeed(locale, { persona: "marketing", intervalMs: 3200, max: 4, seed: 4 });

  return (
    <section id="automation" className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background:radial-gradient(ellipse_at_top_right,var(--accent),transparent_55%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs">
            <Workflow className="h-3.5 w-3.5" />
            {t("land.auto.tag")}
          </div>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{t("land.auto.title")}</h2>
          <p className="mt-4 max-w-lg text-primary-foreground/70">{t("land.auto.subtitle")}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="rounded-3xl border border-primary-foreground/15 bg-background/95 p-5 text-foreground shadow-2xl">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <span className="text-sm font-semibold">{t("land.auto.live")}</span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                <Zap className="h-3 w-3 text-accent" /> n8n
              </span>
            </div>
            <div className="h-[330px] overflow-hidden pr-1">
              <AgentActivityFeed events={events} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
