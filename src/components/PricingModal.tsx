import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { PLAN_DETAILS, useSubscription, type Plan } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "swipe_limit" | "ai_best_fit" | "manual";
};

const PLAN_FEATURES: Record<Plan, { en: string[]; ka: string[] }> = {
  free: {
    en: ["5 Daily Swipes (limit resets daily)", "Browse public listings", "Basic profile"],
    ka: ["5 დღიური სვაიპი (ლიმიტი ახლდება ყოველდღიურად)", "საჯარო განცხადებები", "ძირითადი პროფილი"],
  },
  plus: {
    en: ["Unlimited swipes", "AI Best Fit filter", "Basic compatibility filters", "Verified student badge"],
    ka: ["შეუზღუდავი სვაიპები", "AI Best Fit ფილტრი", "ძირითადი ფილტრები", "ვერიფიცირებული ბეჯი"],
  },
  ultra: {
    en: [
      "Everything in Plus",
      "Priority placement to hosts",
      "Premium AI matches > 90%",
      "Concierge move-in support",
    ],
    ka: [
      "Plus-ის ყველა ფუნქცია",
      "პრიორიტეტული ჩვენება",
      "პრემიუმ მატჩები > 90%",
      "კონსიერჟი მომსახურება",
    ],
  },
};

const ICONS: Record<Plan, typeof Sparkles> = {
  free: Sparkles,
  plus: Zap,
  ultra: Crown,
};

export function PricingModal({ open, onOpenChange, reason = "manual" }: Props) {
  const { plan, setPlan } = useSubscription();
  const { t } = useI18n();
  const navigate = useNavigate();

  const pick = (p: Plan) => {
    if (p === "free") {
      // Downgrade is immediate — no checkout needed.
      setPlan(p);
      toast(t("pricing.toast.free"));
      onOpenChange(false);
      return;
    }
    // Paid plans go through the checkout page.
    onOpenChange(false);
    navigate({ to: "/checkout", search: { plan: p } });
  };

  const headline =
    reason === "swipe_limit"
      ? {
          ka: "მიაღწიე უფასო ლიმიტს",
          en: "You've hit the free swipe limit",
          sub: `${t("matches.upgradeUnlimited")} · Upgrade for unlimited matching`,
        }
      : reason === "ai_best_fit"
        ? {
            ka: "AI Best Fit მხოლოდ Plus და Ultra-სთვის",
            en: "AI Best Fit is exclusive to Plus & Ultra",
            sub: `${t("pricing.orReturn")}. Upgrade now!`,
          }
        : {
            ka: "აირჩიე შენი ტარიფი",
            en: "Choose your plan",
            sub: "Switch any time · გადართე ნებისმიერ დროს",
          };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {headline.ka}
            <span className="ml-2 text-sm font-normal text-muted-foreground">/ {headline.en}</span>
          </DialogTitle>
          <DialogDescription>{headline.sub}</DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid items-stretch gap-4 md:grid-cols-3">
          {(Object.keys(PLAN_DETAILS) as Plan[]).map((p) => {
            const d = PLAN_DETAILS[p];
            const Icon = ICONS[p];
            const isCurrent = plan === p;
            const isHighlight = p === "plus";
            return (
              <div
                key={p}
                className={[
                  "relative flex h-full min-w-0 flex-col rounded-xl border px-4 py-5 space-y-3",
                  isHighlight
                    ? "border-primary/60 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent shadow-[0_0_24px_-8px_var(--primary)]"
                    : "border-border bg-card",
                ].join(" ")}
              >
                {isHighlight && (
                  <span className="absolute -top-2 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                    Popular
                  </span>
                )}
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-display text-base font-semibold">{d.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{d.nameKa}</div>
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-bold leading-none">{d.price}</span>
                  <span className="text-xs text-muted-foreground">GEL / mo</span>
                </div>
                <ul className="flex-1 space-y-2 text-sm">
                  {PLAN_FEATURES[p].en.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <div className="min-w-0 flex-1 break-words">
                        <div className="leading-snug">{f}</div>
                        <div className="text-[11px] leading-snug text-muted-foreground">
                          {PLAN_FEATURES[p].ka[i]}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full whitespace-normal py-4 text-xs leading-tight h-auto"
                  variant={isCurrent ? "outline" : isHighlight ? "default" : "secondary"}
                  onClick={() => pick(p)}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? `${t("pricing.current")} · Current`
                    : p === "free"
                      ? `${t("pricing.switchToFree")} · Switch to Free`
                      : `${t("pricing.upgrade")} · Upgrade`}
                </Button>
              </div>
            );
          })}
        </div>

        {reason === "swipe_limit" && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            {t("pricing.orReturn")}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
