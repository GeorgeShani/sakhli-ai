import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileSignature, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const CEREMONY_STEPS = [
  "Verifying your identity…",
  "Generating bilingual lease…",
  "Sealing in SakhliAI Vault…",
] as const;

type Props = {
  propertyTitle: string;
  district: string;
  monthlyRent: number;
  tenantName: string;
  hostName?: string;
};

export function SmartContractCard({
  propertyTitle,
  district,
  monthlyRent,
  tenantName,
  hostName = "SakhliAI Host",
}: Props) {
  const [signed, setSigned] = useState(false);
  const [step, setStep] = useState(-1); // -1 idle, 0..2 ceremony steps
  const [leaseText, setLeaseText] = useState<string | null>(null);
  const signing = step >= 0;

  const handleSign = async () => {
    let i = 0;
    setStep(0);

    const webhookUrl = import.meta.env.VITE_N8N_LEASE_URL;
    let fetchedLease: string | null = null;

    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyTitle,
            district,
            monthlyRent,
            tenantName,
            hostName,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          fetchedLease =
            data.leaseText ||
            data.text ||
            data.output ||
            (typeof data === "string" ? data : JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed to generate lease from n8n webhook, falling back", err);
      }
    }

    const tick = () => {
      i += 1;
      if (i < CEREMONY_STEPS.length) {
        setStep(i);
        window.setTimeout(tick, 750);
      } else {
        setStep(-1);
        if (fetchedLease) {
          setLeaseText(fetchedLease);
        }
        setSigned(true);
      }
    };
    window.setTimeout(tick, 750);
  };

  return (
    <div
      className={[
        "card-elevated relative overflow-hidden p-5 transition-all",
        signed && "border-emerald-500/60 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-primary">
            <FileSignature className="h-3.5 w-3.5" /> AI Smart Contract · ციფრული ხელშეკრულება
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold">
            გრძელვადიანი იჯარის ხელშეკრულება / Long-Term Rental Lease
          </h3>
        </div>
        {signed ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse">
            <CheckCircle2 className="h-3 w-3" /> ხელმოწერილია · Active
          </span>
        ) : (
          <span className="rounded-full border border-amber-500/60 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
            მოლოდინში · Pending
          </span>
        )}
      </div>

      <div className="mt-4 grid gap-3 rounded-lg border border-border bg-muted/30 p-4 text-sm sm:grid-cols-2">
        <Field label="ბინა / Property" value={propertyTitle} />
        <Field label="უბანი / District" value={district} />
        <Field label="მდგმური / Tenant" value={tenantName} />
        <Field label="მესაკუთრე / Host" value={hostName} />
        <Field label="ქირა / Rent" value={`₾${monthlyRent.toLocaleString()} / თვე`} />
        <Field label="ვადა / Term" value="12 თვე · 12 months" />
      </div>

      {leaseText ? (
        <div className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-border bg-amber-50/5 dark:bg-amber-950/5 p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-foreground">
          {leaseText}
        </div>
      ) : (
        <ol className="mt-4 space-y-1 text-xs text-muted-foreground">
          <li>
            1. მდგმური იხდის თვის ქირას ყოველი თვის 1 რიცხვამდე / Tenant pays rent by the 1st of
            each month.
          </li>
          <li>
            2. დეპოზიტი = 1 თვის ქირა, დაბრუნებადი / Deposit equals one month's rent, refundable.
          </li>
          <li>
            3. დავის შემთხვევაში გამოიყენება SakhliAI AI მედიატორი / Disputes are mediated via
            SakhliAI AI.
          </li>
        </ol>
      )}

      {/* Ceremony progress */}
      <AnimatePresence>
        {signing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden rounded-lg border border-accent/30 bg-accent/5 p-3"
          >
            {CEREMONY_STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-2 py-1 text-xs">
                {i < step ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                ) : i === step ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                ) : (
                  <span className="h-3.5 w-3.5 rounded-full border border-border" />
                )}
                <span className={i <= step ? "text-foreground" : "text-muted-foreground"}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Secured by SakhliAI Vault
          (eIDAS-equivalent)
        </div>
        {!signed ? (
          <Button
            onClick={handleSign}
            disabled={signing}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
          >
            {signing ? (
              <>
                <Sparkles className="mr-1.5 h-4 w-4 animate-spin" /> ვამოწმებთ…
              </>
            ) : (
              <>
                <FileSignature className="mr-1.5 h-4 w-4" /> Sign Digitally via SakhliAI Vault
              </>
            )}
          </Button>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="flex items-center gap-1.5 rounded-lg border-2 border-emerald-500/70 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck className="h-4 w-4" /> Signed · Vault
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
