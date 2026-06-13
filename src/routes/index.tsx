import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles, Users, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SakhliAI — Smart rentals for Georgia" },
      {
        name: "description",
        content:
          "Behavior-based flatmate matching and long-term rentals for students in Georgia.",
      },
      { property: "og:title", content: "SakhliAI — Smart rentals for Georgia" },
      {
        property: "og:description",
        content: "Match with compatible flatmates and long-term homes in Tbilisi, Batumi and beyond.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Hero */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-6xl px-4 pb-24 pt-20 md:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {t("app.tagline")}
            </div>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              <span className="text-gradient">{t("hero.title")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-6">
                <Link to="/role-select">
                  {t("hero.cta.primary")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6">
                <a href="#how">{t("hero.cta.secondary")}</a>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 text-center">
            {[
              ["1,200+", t("hero.stat.students")],
              ["480", t("hero.stat.matches")],
              ["5", t("hero.stat.cities")],
            ].map(([n, l]) => (
              <div key={l} className="card-elevated p-4">
                <div className="font-display text-2xl font-bold md:text-3xl">{n}</div>
                <div className="mt-1 text-xs text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold md:text-4xl">
          {t("features.title")}
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { Icon: Users, t: t("features.match.title"), d: t("features.match.desc") },
            { Icon: Sparkles, t: t("features.swipe.title"), d: t("features.swipe.desc") },
            { Icon: Wallet, t: t("features.split.title"), d: t("features.split.desc") },
          ].map(({ Icon, t: title, d }) => (
            <div key={title} className="card-elevated p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{t("how.title")}</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: t("how.s1.title"), d: t("how.s1.desc") },
              { n: "02", t: t("how.s2.title"), d: t("how.s2.desc") },
              { n: "03", t: t("how.s3.title"), d: t("how.s3.desc") },
            ].map((s) => (
              <div key={s.n} className="card-elevated relative p-6">
                <div className="font-display text-5xl font-extrabold text-accent/40">{s.n}</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" className="h-12 px-6">
              <Link to="/role-select">
                {t("hero.cta.primary")} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
      </footer>
    </div>
  );
}
