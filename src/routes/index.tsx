import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles, Users, Wallet, UsersRound, FileCheck2, MapPin, ShieldCheck, Workflow, GraduationCap } from "lucide-react";

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
      <section className="relative overflow-hidden gradient-hero">
        {/* Neon radial glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,0.18), rgba(6,182,212,0.12) 45%, transparent 75%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 right-[-10%] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(6,182,212,0.15), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {t("app.tagline")}
            </div>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 45%, #10b981 70%, #06b6d4 100%)",
                }}
              >
                {t("hero.title")}
              </span>
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

          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3 md:gap-4 text-center">
            {[
              { n: "1,200+", l: t("hero.stat.students"), Icon: UsersRound },
              { n: "480", l: t("hero.stat.matches"), Icon: FileCheck2 },
              { n: "5", l: t("hero.stat.cities"), Icon: MapPin },
            ].map(({ n, l, Icon }) => (
              <div
                key={l}
                className="group rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-white/[0.07] hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.35)]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Icon className="h-4 w-4 text-emerald-400/80" />
                  <div className="font-display text-2xl font-bold md:text-3xl">{n}</div>
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold md:text-4xl">
          {t("features.title")}
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              Icon: Users,
              title: "Behavioral Compatibility Matching",
              desc: t("features.match.desc"),
              tint: "from-emerald-500/20 to-emerald-500/5",
              ring: "group-hover:border-emerald-500/40",
              icon: "text-emerald-400",
            },
            {
              Icon: Sparkles,
              title: "Swipe-Powered Discovery Engine",
              desc: t("features.swipe.desc"),
              tint: "from-cyan-500/20 to-cyan-500/5",
              ring: "group-hover:border-cyan-500/40",
              icon: "text-cyan-400",
            },
            {
              Icon: Wallet,
              title: "AI-Driven Proportional Bill Splitting",
              desc: t("features.split.desc"),
              tint: "from-violet-500/20 to-violet-500/5",
              ring: "group-hover:border-violet-500/40",
              icon: "text-violet-400",
            },
          ].map(({ Icon, title, desc, tint, ring, icon }) => (
            <div
              key={title}
              className={`group rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_-20px_rgba(16,185,129,0.25)] ${ring}`}
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${tint} shadow-inner`}
              >
                <Icon className={`h-5 w-5 ${icon}`} />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        {/* Trust & Security Benchmarks */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400/80" />
              <span>Secured via Supabase Cryptography</span>
            </div>
            <div className="h-3 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-cyan-400/80" />
              <span>Automated via n8n Agent Workflows</span>
            </div>
            <div className="h-3 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-violet-400/80" />
              <span>Verified Academic Domain Check (.edu.ge)</span>
            </div>
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{t("how.title")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: t("how.s1.title"), d: t("how.s1.desc") },
              { n: "02", t: t("how.s2.title"), d: t("how.s2.desc") },
              { n: "03", t: t("how.s3.title"), d: t("how.s3.desc") },
            ].map((s) => (
              <div
                key={s.n}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30"
              >
                <div className="font-display text-5xl font-extrabold text-accent/40">{s.n}</div>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
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
