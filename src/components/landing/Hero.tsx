import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, GraduationCap, Sparkles, BadgeCheck, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { flatmates } from "@/lib/mock-data";

const UNIVERSITIES = ["TSU", "GTU", "Iliauni", "Free University", "BTU", "Caucasus University"];

/** A looping, self-swiping demo deck that shows the product in ~3 seconds. */
function HeroDemo() {
  const { t } = useI18n();
  // Pick a few photogenic, high-scoring profiles.
  const deck = flatmates.filter((f) => f.verified).slice(0, 4);
  const [idx, setIdx] = useState(0);
  const [stamp, setStamp] = useState(false);

  useEffect(() => {
    const stampT = window.setTimeout(() => setStamp(true), 1600);
    const nextT = window.setTimeout(() => {
      setStamp(false);
      setIdx((i) => (i + 1) % deck.length);
    }, 2600);
    return () => {
      window.clearTimeout(stampT);
      window.clearTimeout(nextT);
    };
  }, [idx, deck.length]);

  const f = deck[idx];
  const score = f.aiPremiumScore ?? 88 + (idx % 3) * 2;

  return (
    <div className="relative mx-auto h-[420px] w-[300px]">
      {/* Stacked ghost cards behind for depth */}
      <div className="absolute left-1/2 top-3 h-full w-[88%] -translate-x-1/2 rounded-3xl border border-border bg-card/40" />
      <div className="absolute left-1/2 top-1.5 h-full w-[94%] -translate-x-1/2 rounded-3xl border border-border bg-card/70" />

      <AnimatePresence mode="popLayout">
        <motion.div
          key={f.id}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
          exit={{ x: 380, rotate: 18, opacity: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          className="card-elevated absolute inset-0 overflow-hidden rounded-3xl"
        >
          <div className="relative h-1/2 bg-gradient-to-br from-primary/15 to-accent/15">
            <img src={f.avatar} alt={f.name} className="h-full w-full object-contain p-6" />
            <AnimatePresence>
              {stamp && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
                  animate={{ scale: 1, opacity: 1, rotate: -8 }}
                  className="absolute left-4 top-4 flex items-center gap-1.5 rounded-lg border-2 border-success bg-background/80 px-3 py-1 text-sm font-extrabold uppercase text-success backdrop-blur"
                >
                  <Heart className="h-4 w-4 fill-success" /> {t("land.hero.demo.match")}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display text-lg font-bold">{f.name}</h3>
              {f.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
              <span className="ml-auto font-display text-lg font-extrabold text-success">{score}%</span>
            </div>
            <p className="text-sm text-muted-foreground">{f.university}</p>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/80">{f.bio}</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <motion.div
                key={f.id + "-bar"}
                className="h-full rounded-full bg-success"
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Hero() {
  const { t } = useI18n();
  return (
    <section className="gradient-hero relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-16 md:grid-cols-2 md:pb-28 md:pt-24">
        {/* Left: copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            {t("land.hero.badge")}
          </div>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            {t("land.hero.title.a")}{" "}
            <span className="text-gradient">{t("land.hero.title.b")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {t("land.hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 px-6">
              <Link to="/role-select" search={{ role: "student" }}>
                <GraduationCap className="mr-2 h-4 w-4" />
                {t("land.hero.cta.student")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6">
              <Link to="/role-select" search={{ role: "host" }}>
                <Building2 className="mr-2 h-4 w-4" />
                {t("land.hero.cta.host")}
              </Link>
            </Button>
          </div>

          <div className="mt-10">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("land.hero.trust")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
              {UNIVERSITIES.map((u) => (
                <span key={u} className="font-display text-sm font-semibold text-foreground/45">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: live demo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="hidden md:block"
        >
          <HeroDemo />
        </motion.div>
      </div>
    </section>
  );
}
