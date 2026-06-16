import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Moon, Brush, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import type { StudentProfile } from "@/lib/student-store";

/** Derive a short "housing personality" from the quiz answers. */
function persona(profile: StudentProfile, t: (k: string) => string) {
  const clean =
    profile.cleanliness >= 4
      ? t("persona.neat")
      : profile.cleanliness <= 2
        ? t("persona.relaxed")
        : t("persona.balanced");
  const sleep =
    profile.sleep === "night_owl"
      ? t("persona.nightowl")
      : profile.sleep === "early_bird"
        ? t("persona.earlybird")
        : t("persona.flexible");
  const social = profile.quiet ? t("persona.quiet") : t("persona.social");
  return { title: `${clean} ${sleep}`, social };
}

export function OnboardingReveal({
  profile,
  onContinue,
}: {
  profile: StudentProfile;
  onContinue: () => void;
}) {
  const { t } = useI18n();
  const p = persona(profile, t);

  const chips = [
    { Icon: Moon, label: p.title.split(" ").slice(1).join(" ") },
    { Icon: Brush, label: `${profile.cleanliness}/5` },
    { Icon: Users, label: p.social },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="card-elevated relative w-full max-w-md overflow-hidden p-8 text-center"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-accent/25 to-transparent blur-2xl" />

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground"
        >
          <Sparkles className="h-6 w-6" />
        </motion.div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-accent">
          {t("onboarding.reveal.tag")}
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold capitalize">{p.title}</h1>

        {profile.name && <p className="mt-1 text-sm text-muted-foreground">{profile.name}</p>}

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm capitalize"
            >
              <Icon className="h-3.5 w-3.5 text-accent" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{t("onboarding.reveal.budget")}</span>
          <span className="font-display font-bold text-gradient">₾{profile.budget}</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          {t("onboarding.reveal.ready")}
        </div>

        <Button className="mt-6 h-12 w-full" onClick={onContinue}>
          {t("onboarding.reveal.cta")} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
