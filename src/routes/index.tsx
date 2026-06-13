import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import {
  ArrowRight,
  Sparkles,
  Users,
  Wallet,
  ShieldCheck,
  Workflow,
  GraduationCap,
  Heart,
  Moon,
  Coffee,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

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
        content:
          "Match with compatible flatmates and long-term homes in Tbilisi, Batumi and beyond.",
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

      {/* HERO — split layout with product snippet */}
      <section className="relative overflow-hidden">
        {/* Neon background blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -left-32 h-[560px] w-[560px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(16,185,129,0.20), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-20 right-[-10%] h-[520px] w-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(6,182,212,0.18), transparent 72%)",
          }}
        />
        {/* Subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-14 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
          {/* LEFT — copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              {t("app.tagline")}
            </div>

            <h1 className="mt-5 font-display text-[2.7rem] font-extrabold leading-[1.02] tracking-tight md:text-[3.6rem]">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground)) 50%, #10b981 75%, #06b6d4 100%)",
                }}
              >
                {t("hero.title")}
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              SakhliAI blends behavioral compatibility with seasonal hybrid
              renting. No generic listings — just perfect living algorithms.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {/* Pulsing radar glow button */}
              <div className="relative">
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 animate-ping rounded-md bg-emerald-400/30"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 rounded-md bg-emerald-400/20 blur-xl"
                />
                <Button asChild size="lg" className="h-12 px-6">
                  <Link to="/role-select">
                    {t("hero.cta.primary")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-white/15 bg-white/[0.03] px-6 backdrop-blur-md hover:bg-white/[0.06]"
              >
                <a href="#how">{t("hero.cta.secondary")}</a>
              </Button>
            </div>

            {/* Metric ribbon */}
            <div className="mt-10 flex flex-wrap items-stretch overflow-hidden rounded-2xl border border-white/10 bg-[#0d111c]/60 backdrop-blur-xl">
              {[
                {
                  n: "1,200+",
                  l: "Active Student Profiles",
                  Icon: Users,
                  c: "text-emerald-400",
                },
                {
                  n: "480+",
                  l: "Secured E-Leases",
                  Icon: CheckCircle2,
                  c: "text-cyan-400",
                },
                {
                  n: "Sync",
                  l: "Tbilisi ↔ Rustavi Transit",
                  Icon: TrendingUp,
                  c: "text-emerald-400",
                },
              ].map(({ n, l, Icon, c }, i) => (
                <div
                  key={l}
                  className={`group relative flex-1 min-w-[140px] px-4 py-3 transition-colors hover:bg-white/[0.04] ${
                    i > 0 ? "border-l border-white/10" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <Icon className={`h-3.5 w-3.5 ${c}`} />
                    <div className="font-display text-xl font-bold tracking-tight">
                      {n}
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — interactive app snippet */}
          <div className="relative">
            <AppSnippet />
          </div>
        </div>
      </section>

      {/* FEATURES — asymmetric blueprint */}
      <section className="relative mx-auto max-w-6xl px-4 py-16">
        {/* glowing divider */}
        <div
          aria-hidden
          className="mx-auto mb-12 h-px w-2/3 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
        />

        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {t("features.title")}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Engineered for student life — habits, budgets, and seasonal
            mobility, all algorithmically aligned.
          </p>
        </div>

        <div className="group/grid grid gap-4 md:grid-cols-6 md:grid-rows-2">
          {/* Big feature — Behavioral matching */}
          <FeatureCard
            className="md:col-span-4 md:row-span-2"
            Icon={Users}
            tint="emerald"
            eyebrow="01 — Compatibility"
            title="Behavioral Compatibility Matching"
            desc="A multi-factor profile model — habits, sleep cycles, noise tolerance, study load — generates a 0–100 fit score for every potential flatmate."
            big
          />
          <FeatureCard
            className="md:col-span-2"
            Icon={Sparkles}
            tint="cyan"
            eyebrow="02 — Discovery"
            title="Swipe-Powered Discovery"
            desc="Tinder-grade gesture flow for flats and flatmates."
          />
          <FeatureCard
            className="md:col-span-2"
            Icon={Wallet}
            tint="emerald"
            eyebrow="03 — Finance"
            title="AI Proportional Bill Splitting"
            desc="Pro-rated by move-in dates and usage windows."
          />
        </div>

        {/* glowing divider */}
        <div
          aria-hidden
          className="mx-auto my-12 h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
        />

        {/* Trust strip */}
        <div className="rounded-2xl border border-white/10 bg-[#0d111c]/60 px-4 py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400/80" />
              <span>Secured via Supabase Cryptography</span>
            </div>
            <div className="hidden h-3 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-cyan-400/80" />
              <span>Automated via n8n Agent Workflows</span>
            </div>
            <div className="hidden h-3 w-px bg-white/10 sm:block" />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-400/80" />
              <span>Verified Academic Domain Check (.edu.ge)</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section id="how" className="border-t border-white/5 bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-bold md:text-4xl">
            {t("how.title")}
          </h2>
          <div className="group/steps mt-10 grid gap-4 md:grid-cols-3">
            {[
              { n: "01", t: t("how.s1.title"), d: t("how.s1.desc") },
              { n: "02", t: t("how.s2.title"), d: t("how.s2.desc") },
              { n: "03", t: t("how.s3.title"), d: t("how.s3.desc") },
            ].map((s) => (
              <div
                key={s.n}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d111c]/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 group-hover/steps:opacity-60 hover:!opacity-100"
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                />
                <div className="font-display text-5xl font-extrabold text-emerald-400/30">
                  {s.n}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.d}
                </p>
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

      <footer className="border-t border-white/5 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
      </footer>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function FeatureCard({
  className = "",
  Icon,
  tint,
  eyebrow,
  title,
  desc,
  big = false,
}: {
  className?: string;
  Icon: React.ComponentType<{ className?: string }>;
  tint: "emerald" | "cyan";
  eyebrow: string;
  title: string;
  desc: string;
  big?: boolean;
}) {
  const ring =
    tint === "emerald"
      ? "hover:border-emerald-500/40 hover:shadow-[0_30px_80px_-30px_rgba(16,185,129,0.45)]"
      : "hover:border-cyan-500/40 hover:shadow-[0_30px_80px_-30px_rgba(6,182,212,0.45)]";
  const iconBg =
    tint === "emerald"
      ? "from-emerald-500/25 to-emerald-500/5 text-emerald-300"
      : "from-cyan-500/25 to-cyan-500/5 text-cyan-300";
  const eyebrowColor =
    tint === "emerald" ? "text-emerald-400/80" : "text-cyan-400/80";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d111c]/60 p-6 backdrop-blur-xl transition-all duration-300 group-hover/grid:opacity-50 hover:!opacity-100 hover:-translate-y-1 ${ring} ${className}`}
    >
      {/* corner glow */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl transition-opacity duration-300 ${
          tint === "emerald" ? "bg-emerald-500/10" : "bg-cyan-500/10"
        } opacity-0 group-hover:opacity-100`}
      />
      <div className="flex items-start justify-between">
        <div
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br shadow-inner transition-transform duration-300 group-hover:-translate-y-0.5 ${iconBg}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <span className={`text-[10px] uppercase tracking-[0.18em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
      </div>
      <h3
        className={`mt-5 font-display font-bold tracking-tight transition-transform duration-300 group-hover:-translate-y-0.5 ${
          big ? "text-2xl md:text-[1.7rem] leading-tight" : "text-lg"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-2 leading-relaxed text-muted-foreground ${
          big ? "max-w-lg text-[0.95rem]" : "text-sm"
        }`}
      >
        {desc}
      </p>
      {big && (
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            "Sleep cycle",
            "Noise tolerance",
            "Study load",
            "Budget",
            "Cleanliness",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-muted-foreground/90"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AppSnippet() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Glow halo */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-emerald-500/15 via-transparent to-cyan-500/15 blur-2xl"
      />

      {/* Main match card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d111c]/80 p-5 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-emerald-500/40 to-cyan-500/40">
              <div className="flex h-full w-full items-center justify-center font-display text-base font-bold">
                NA
              </div>
            </div>
            <div>
              <div className="font-display text-sm font-semibold">Nino A.</div>
              <div className="text-[11px] text-muted-foreground">
                TSU · Architecture · 21
              </div>
            </div>
          </div>
          <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
            94% Match
          </div>
        </div>

        {/* Match meter */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Compatibility</span>
            <span className="text-emerald-300">High</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
              style={{ width: "94%" }}
            />
          </div>
        </div>

        {/* Habit chips */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { Icon: Moon, label: "Early sleeper" },
            { Icon: Coffee, label: "Quiet AM" },
            { Icon: Heart, label: "Pet friendly" },
          ].map(({ Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[10.5px] text-muted-foreground"
            >
              <Icon className="h-3 w-3 text-emerald-400" />
              <span className="truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Dual season pricing */}
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Hybrid Rent · Vake, Tbilisi</span>
            <span className="text-cyan-300">Dual season</span>
          </div>
          <div className="mt-2 flex items-end gap-4">
            <div>
              <div className="font-display text-lg font-bold">
                ₾ 720<span className="text-xs text-muted-foreground">/mo</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Sep — May (student)
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="font-display text-lg font-bold text-cyan-300">
                ₾ 1,450<span className="text-xs text-muted-foreground">/wk</span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Jun — Aug (tourist)
              </div>
            </div>
          </div>
          <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white/5">
            <div className="absolute inset-y-0 left-0 w-[68%] rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
            <div className="absolute -top-1 left-[68%] h-3 w-3 -translate-x-1/2 rounded-full border border-white/40 bg-white shadow" />
          </div>
        </div>
      </div>

      {/* Floating verification badge */}
      <div className="absolute -left-4 bottom-6 hidden rounded-xl border border-white/10 bg-[#0d111c]/90 px-3 py-2 backdrop-blur-xl shadow-lg sm:flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <div>
          <div className="text-[11px] font-semibold leading-tight">
            .edu.ge verified
          </div>
          <div className="text-[10px] text-muted-foreground leading-tight">
            Academic email · 2s ago
          </div>
        </div>
      </div>

      {/* Floating fit-score chip */}
      <div className="absolute -right-3 -top-3 hidden rounded-full border border-cyan-400/30 bg-[#0d111c]/90 px-3 py-1.5 backdrop-blur-xl shadow-lg sm:flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        <span className="text-[11px] font-semibold text-cyan-200">
          AI Fit Engine
        </span>
      </div>
    </div>
  );
}
