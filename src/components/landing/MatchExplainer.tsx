import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { CompatibilityBreakdown, CompatibilityMeter } from "@/components/CompatibilityMeter";
import { flatmates } from "@/lib/mock-data";

export function MatchExplainer() {
  const { t } = useI18n();
  // Two real demo profiles being compared.
  const [a, b] = [flatmates[0], flatmates[4]];

  const factors = [
    { label: t("land.match.factor.sleep"), value: 82 },
    { label: t("land.match.factor.clean"), value: 91 },
    { label: t("land.match.factor.budget"), value: 76 },
    { label: t("land.match.factor.lifestyle"), value: 88 },
  ];

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t("land.match.tag")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{t("land.match.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("land.match.subtitle")}</p>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-4xl items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
          {/* Profile A */}
          <Reveal>
            <ProfileChip name={a.name} uni={a.university} avatar={a.avatar} />
          </Reveal>

          {/* Center: overall meter */}
          <Reveal delay={0.1}>
            <motion.div
              className="mx-auto flex h-28 w-28 flex-col items-center justify-center rounded-full border-4 border-success/30 bg-card"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <span className="font-display text-3xl font-extrabold text-success">86%</span>
              <span className="text-[11px] text-muted-foreground">{t("land.match.overall")}</span>
            </motion.div>
          </Reveal>

          {/* Profile B */}
          <Reveal delay={0.2}>
            <ProfileChip name={b.name} uni={b.university} avatar={b.avatar} />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-xl rounded-2xl border border-border bg-card p-6">
          <CompatibilityBreakdown factors={factors} />
          <div className="mt-5 border-t border-border pt-4">
            <CompatibilityMeter value={86} label={t("land.match.overall")} size="lg" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ProfileChip({ name, uni, avatar }: { name: string; uni: string; avatar: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-border bg-gradient-to-br from-primary/15 to-accent/15">
        <img src={avatar} alt={name} className="h-full w-full object-contain p-1.5" />
      </div>
      <div className="mt-3 flex items-center gap-1 font-display font-semibold">
        {name} <BadgeCheck className="h-4 w-4 text-accent" />
      </div>
      <p className="text-xs text-muted-foreground">{uni}</p>
    </div>
  );
}
