import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Heart, X, Wallet, Scale, FileSignature, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";

type Feature = {
  titleKey: string;
  descKey: string;
  visual: ReactNode;
};

/* ---- Small mock UI visuals (no external assets needed) ---- */

function DiscoverMock() {
  return (
    <div className="mx-auto w-56">
      <div className="card-elevated overflow-hidden rounded-2xl">
        <div className="h-28 bg-gradient-to-br from-primary/20 to-accent/20" />
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-display font-bold">Nino K.</span>
            <span className="font-display font-extrabold text-success">94%</span>
          </div>
          <p className="text-xs text-muted-foreground">Tbilisi State University</p>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive/30 text-destructive">
          <X className="h-5 w-5" />
        </span>
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success text-success-foreground">
          <Heart className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function SplitMock() {
  const rows = [
    { name: "Nino", pct: 41, amount: "₾164" },
    { name: "Giorgi", pct: 33, amount: "₾132" },
    { name: "Ana", pct: 26, amount: "₾104" },
  ];
  return (
    <div className="card-elevated mx-auto w-64 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Wallet className="h-4 w-4 text-emerald-500" /> October bills · ₾400
      </div>
      {rows.map((r, i) => (
        <div key={r.name} className="mb-2">
          <div className="flex justify-between text-xs">
            <span>{r.name}</span>
            <span className="font-medium">{r.amount}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <motion.div
              className="h-full rounded-full bg-emerald-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${r.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          </div>
        </div>
      ))}
      <p className="mt-2 text-[11px] text-muted-foreground">Nino moved in 8 days late → pays less.</p>
    </div>
  );
}

function MediatorMock() {
  return (
    <div className="card-elevated mx-auto w-64 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Scale className="h-4 w-4 text-amber-500" /> House-rules mediator
      </div>
      <div className="space-y-2">
        <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3 py-1.5 text-xs text-primary-foreground">
          He plays music until 2am 😤
        </div>
        <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-1.5 text-xs">
          Proposed: quiet hours 23:00–08:00, Saturday exception until 01:00. Fair to both. ✅
        </div>
      </div>
    </div>
  );
}

function LeaseMock() {
  return (
    <div className="card-elevated mx-auto w-60 rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <FileSignature className="h-4 w-4 text-violet-500" /> Lease agreement
      </div>
      <div className="space-y-1.5">
        {["Property · Vake 2BR", "Rent · ₾1,800 / mo", "Term · 12 months"].map((l) => (
          <div key={l} className="h-2 rounded bg-secondary text-[0px]">
            {l}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-success/15 px-3 py-2 text-xs font-medium text-success">
        <ShieldCheck className="h-4 w-4" /> Signed · SakhliAI Vault
      </div>
    </div>
  );
}

export function FeatureShowcase() {
  const { t } = useI18n();
  const features: Feature[] = [
    { titleKey: "land.feat.discover.title", descKey: "land.feat.discover.desc", visual: <DiscoverMock /> },
    { titleKey: "land.feat.split.title", descKey: "land.feat.split.desc", visual: <SplitMock /> },
    { titleKey: "land.feat.mediator.title", descKey: "land.feat.mediator.desc", visual: <MediatorMock /> },
    { titleKey: "land.feat.lease.title", descKey: "land.feat.lease.desc", visual: <LeaseMock /> },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent">{t("land.features.tag")}</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">{t("land.features.title")}</h2>
      </Reveal>

      <div className="mt-16 space-y-16 md:space-y-24">
        {features.map((f, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={f.titleKey} className="grid items-center gap-8 md:grid-cols-2">
              <Reveal className={flip ? "md:order-2" : ""}>
                <h3 className="font-display text-2xl font-bold md:text-3xl">{t(f.titleKey)}</h3>
                <p className="mt-4 max-w-md text-muted-foreground">{t(f.descKey)}</p>
              </Reveal>
              <Reveal delay={0.1} className={flip ? "md:order-1" : ""}>
                <div className="rounded-3xl border border-border bg-surface p-8">{f.visual}</div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
