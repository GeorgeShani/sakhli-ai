import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Sparkles, Users, Wallet, Home as HomeIcon, Moon, Coffee, BookOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SakhliAI — Your next home. Your kind of people." },
      {
        name: "description",
        content:
          "SakhliAI pairs students across Georgia with compatible flatmates — matched by how you live, not just where.",
      },
      { property: "og:title", content: "SakhliAI — Your next home. Your kind of people." },
      {
        property: "og:description",
        content: "Behavior-based flatmate matching for students in Tbilisi, Batumi and beyond.",
      },
    ],
  }),
  component: HomePage,
});

type Palette = {
  bg: string;
  bg2: string;
  electric: string;
  electricSoft: string;
  text: string;
  textSoft: string; // rgba for opacity
  muted: string;
  cardBg: string;
  cardBorder: string;
  navBg: string;
  navBorder: string;
  borderSoft: string;
  glassBg: string;
  grainBlend: "overlay" | "multiply";
  grainOpacity: number;
};

const darkPalette: Palette = {
  bg: "#0A0F1E",
  bg2: "#0E1530",
  electric: "#2D6FFF",
  electricSoft: "#5B8CFF",
  text: "#F5F2ED",
  textSoft: "rgba(245,242,237,0.72)",
  muted: "#9BA6C2",
  cardBg: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(45,111,255,0.28)",
  navBg: "rgba(10,15,30,0.55)",
  navBorder: "rgba(245,242,237,0.06)",
  borderSoft: "rgba(245,242,237,0.08)",
  glassBg: "rgba(255,255,255,0.025)",
  grainBlend: "overlay",
  grainOpacity: 0.045,
};

const lightPalette: Palette = {
  bg: "#F5F2ED",
  bg2: "#EDE7DE",
  electric: "#2D6FFF",
  electricSoft: "#5B8CFF",
  text: "#0A0F1E",
  textSoft: "rgba(10,15,30,0.72)",
  muted: "#5A6885",
  cardBg: "rgba(255,255,255,0.7)",
  cardBorder: "rgba(45,111,255,0.28)",
  navBg: "rgba(245,242,237,0.7)",
  navBorder: "rgba(10,15,30,0.06)",
  borderSoft: "rgba(10,15,30,0.08)",
  glassBg: "rgba(255,255,255,0.55)",
  grainBlend: "multiply",
  grainOpacity: 0.06,
};

function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const update = () => setIsDark(el.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

function HomePage() {
  const { t } = useI18n();
  const isDark = useIsDark();
  const p = isDark ? darkPalette : lightPalette;

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: p.bg, color: p.text, fontFamily: '"DM Sans", Inter, system-ui, sans-serif' }}
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          mixBlendMode: p.grainBlend,
          opacity: p.grainOpacity,
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <LandingNav p={p} />

      {/* HERO */}
      <section className="relative z-[2]">
        {/* Radial glow behind the card on the right */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[-10%] top-[-10%] h-[640px] w-[640px] rounded-full"
          style={{
            background: `radial-gradient(closest-side, ${p.electric}55, ${p.electric}10 55%, transparent 75%)`,
            filter: "blur(8px)",
          }}
        />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-24 md:grid-cols-12 md:pt-24 md:pb-32">
          {/* LEFT */}
          <div className="md:col-span-7">
            {/* Animated badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs"
              style={{
                borderColor: "rgba(45,111,255,0.35)",
                background: "rgba(45,111,255,0.08)",
                color: p.text,
              }}
            >
              <span className="relative inline-flex h-2 w-2">
                <span
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  style={{ background: p.electricSoft }}
                />
                <span
                  className="relative inline-flex h-2 w-2 rounded-full"
                  style={{ background: p.electric }}
                />
              </span>
              Live in Tbilisi, Batumi & 3 more cities
            </div>

            <h1
              className="mt-6 text-left text-5xl leading-[1.05] tracking-tight md:text-[68px] md:leading-[1.02]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(100deg, ${p.text} 0%, ${p.electricSoft} 55%, #B5A8FF 100%)`
                    : `linear-gradient(100deg, ${p.text} 0%, ${p.electric} 55%, #6E4BFF 100%)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {t("hero.title")}
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl text-left text-base leading-relaxed md:text-lg"
              style={{ color: p.textSoft }}
            >
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl px-6 border-0 shadow-[0_10px_30px_-10px_rgba(45,111,255,0.6)]"
                style={{ background: p.electric, color: "#fff" }}
              >
                <Link to="/role-select">
                  {t("hero.cta.primary")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <a
                href="#how"
                className="inline-flex h-12 items-center rounded-xl border px-5 text-sm transition-colors"
                style={{
                  borderColor: p.borderSoft,
                  color: p.text,
                  background: isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.5)",
                }}
              >
                {t("hero.cta.secondary")}
              </a>
            </div>

            {/* Stats — frosted glass cards */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["1,200+", t("hero.stat.students")],
                ["480", t("hero.stat.matches")],
                ["5", t("hero.stat.cities")],
              ].map(([n, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border px-4 py-4 backdrop-blur-md"
                  style={{
                    borderColor: p.cardBorder,
                    background: p.cardBg,
                  }}
                >
                  <div
                    className="text-2xl md:text-3xl"
                    style={{
                      fontFamily: '"Playfair Display", Georgia, serif',
                      fontWeight: 600,
                      color: p.text,
                    }}
                  >
                    {n}
                  </div>
                  <div className="mt-1 text-[11px] leading-tight" style={{ color: p.muted }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — floating match card */}
          <div className="relative md:col-span-5">
            <MatchCard p={p} />
          </div>
        </div>

        {/* Wavy divider */}
        <WavyDivider color={p.bg2} />
      </section>

      {/* Features */}
      <section className="relative z-[2]" style={{ background: p.bg2 }}>
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="max-w-2xl text-3xl md:text-4xl"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: p.text }}
          >
            {t("features.title")}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { Icon: Users, t: t("features.match.title"), d: t("features.match.desc") },
              { Icon: Sparkles, t: t("features.swipe.title"), d: t("features.swipe.desc") },
              { Icon: Wallet, t: t("features.split.title"), d: t("features.split.desc") },
            ].map(({ Icon, t: title, d }) => (
              <div
                key={title}
                className="rounded-2xl border p-6 backdrop-blur-sm"
                style={{
                  borderColor: p.borderSoft,
                  background: p.glassBg,
                }}
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: "rgba(45,111,255,0.15)", color: p.electric }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3
                  className="mt-4 text-lg"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: p.text }}
                >
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: p.textSoft }}>
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
        <WavyDivider color={p.bg} flip />
      </section>

      {/* How */}
      <section id="how" className="relative z-[2]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2
            className="text-3xl md:text-4xl"
            style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: p.text }}
          >
            {t("how.title")}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: t("how.s1.title"), d: t("how.s1.desc") },
              { n: "02", t: t("how.s2.title"), d: t("how.s2.desc") },
              { n: "03", t: t("how.s3.title"), d: t("how.s3.desc") },
            ].map((s) => (
              <div
                key={s.n}
                className="relative rounded-2xl border p-6"
                style={{
                  borderColor: p.borderSoft,
                  background: p.glassBg,
                }}
              >
                <div
                  className="text-5xl"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontWeight: 700,
                    fontStyle: "italic",
                    color: "rgba(45,111,255,0.45)",
                  }}
                >
                  {s.n}
                </div>
                <h3
                  className="mt-2 text-lg"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: p.text }}
                >
                  {s.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: p.textSoft }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-6 border-0 shadow-[0_10px_30px_-10px_rgba(45,111,255,0.6)]"
              style={{ background: p.electric, color: "#fff" }}
            >
              <Link to="/role-select">
                {t("hero.cta.primary")} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer
        className="relative z-[2] border-t py-8 text-center text-xs"
        style={{ borderColor: p.borderSoft, color: p.muted }}
      >
        © {new Date().getFullYear()} {t("app.name")}. {t("footer.rights")}
      </footer>
    </div>
  );
}

function LandingNav({ p }: { p: Palette }) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-30">
      <div
        className="border-b backdrop-blur-md"
        style={{
          background: p.navBg,
          borderColor: p.navBorder,
        }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ background: p.electric, color: "#fff" }}
            >
              <HomeIcon className="h-4 w-4" />
            </span>
            <span
              className="text-lg tracking-tight"
              style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: p.text }}
            >
              {t("app.name")}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <span
              className="rounded-full px-3.5 py-1.5 text-sm"
              style={{ background: "rgba(45,111,255,0.16)", color: p.text }}
            >
              {t("nav.home")}
            </span>
            <a
              href="#how"
              className="rounded-full px-3.5 py-1.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: p.textSoft }}
            >
              {t("hero.cta.secondary")}
            </a>
            <Link
              to="/matches"
              className="rounded-full px-3.5 py-1.5 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: p.textSoft }}
            >
              {t("nav.matches")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/role-select"
              className="inline-flex h-9 items-center rounded-xl px-4 text-sm font-medium shadow-[0_8px_24px_-10px_rgba(45,111,255,0.7)]"
              style={{ background: p.electric, color: "#fff" }}
            >
              {t("nav.start")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function MatchCard({ p }: { p: Palette }) {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Stacked echo card */}
      <div
        className="absolute -right-3 top-6 h-full w-full rounded-3xl border"
        style={{
          borderColor: "rgba(45,111,255,0.18)",
          background: "rgba(45,111,255,0.05)",
          transform: "rotate(3deg)",
        }}
      />
      <div
        className="relative rounded-3xl border p-6 backdrop-blur-md"
        style={{
          borderColor: p.borderSoft,
          background: p.cardBg,
          boxShadow: "0 30px 80px -30px rgba(45,111,255,0.5)",
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: p.muted }}>
            New match
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px]"
            style={{ background: "rgba(91,140,255,0.18)", color: p.electric }}
          >
            94% fit
          </span>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-lg"
            style={{
              background: "linear-gradient(135deg, #2D6FFF, #8B7DFF)",
              color: "#fff",
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
            }}
          >
            NK
          </div>
          <div className="min-w-0">
            <div
              className="truncate text-lg"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 600, color: p.text }}
            >
              Nino K.
            </div>
            <div className="text-xs" style={{ color: p.muted }}>
              TSU · Architecture · Vake
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {[
            { Icon: Moon, label: "Sleeps early · quiet evenings" },
            { Icon: BookOpen, label: "Studio hours 5–8pm" },
            { Icon: Coffee, label: "Slow mornings, espresso first" },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 text-xs" style={{ color: p.textSoft }}>
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: "rgba(45,111,255,0.14)", color: p.electric }}
              >
                <Icon className="h-3 w-3" />
              </span>
              {label}
            </div>
          ))}
        </div>

        <div className="mt-5 border-t pt-4" style={{ borderColor: p.borderSoft }}>
          <div className="flex items-center justify-between text-[11px]" style={{ color: p.muted }}>
            <span>Budget · 900 GEL</span>
            <span>Move-in · Sep 1</span>
          </div>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: p.borderSoft }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: "94%", background: `linear-gradient(90deg, ${p.electric}, ${p.electricSoft})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WavyDivider({ color, flip = false }: { color: string; flip?: boolean }) {
  return (
    <div className="relative -mb-px w-full leading-[0]" style={{ transform: flip ? "rotate(180deg)" : undefined }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="block h-[60px] w-full md:h-[80px]"
        aria-hidden
      >
        <path
          d="M0,40 C240,90 480,0 720,40 C960,80 1200,10 1440,50 L1440,80 L0,80 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
