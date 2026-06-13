import { useState } from "react";
import { CheckCircle2, FileSignature, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [signing, setSigning] = useState(false);

  const handleSign = () => {
    setSigning(true);
    setTimeout(() => {
      setSigning(false);
      setSigned(true);
    }, 1100);
  };

  return (
    <div
      className={[
        "card-elevated relative overflow-hidden p-5 transition-all",
        signed && "border-emerald-500/60 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)]",
      ].filter(Boolean).join(" ")}
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

      <ol className="mt-4 space-y-1 text-xs text-muted-foreground">
        <li>1. მდგმური იხდის თვის ქირას ყოველი თვის 1 რიცხვამდე / Tenant pays rent by the 1st of each month.</li>
        <li>2. დეპოზიტი = 1 თვის ქირა, დაბრუნებადი / Deposit equals one month's rent, refundable.</li>
        <li>3. დავის შემთხვევაში გამოიყენება SakhliAI AI მედიატორი / Disputes are mediated via SakhliAI AI.</li>
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Secured by SakhliAI Vault (eIDAS-equivalent)
        </div>
        {!signed ? (
          <Button onClick={handleSign} disabled={signing} className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
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
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            ✓ Signed · {new Date().toLocaleString("ka-GE")}
          </div>
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
