import { Check, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

export function ProblemSection() {
  const { t } = useI18n();
  const before = ["land.before.1", "land.before.2", "land.before.3", "land.before.4"];
  const after = ["land.after.1", "land.after.2", "land.after.3", "land.after.4"];

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">
          {t("land.problem.tag")}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          {t("land.problem.title")}
        </h2>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-muted-foreground">
              {t("land.before.title")}
            </h3>
            <ul className="mt-5 space-y-3">
              {before.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <X className="h-3 w-3" />
                  </span>
                  <span className="text-foreground/80">{t(k)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="h-full rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/10 to-transparent p-6 shadow-[var(--shadow-card)]">
            <h3 className="font-display text-lg font-semibold">{t("land.after.title")}</h3>
            <ul className="mt-5 space-y-3">
              {after.map((k) => (
                <li key={k} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="font-medium">{t(k)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
