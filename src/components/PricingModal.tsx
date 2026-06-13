import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Zap } from "lucide-react";
import { PLAN_DETAILS, useSubscription, type Plan } from "@/lib/subscription";
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

  const pick = (p: Plan) => {
    setPlan(p);
    if (p === "free") {
      toast("გადახვედი Free ტარიფზე · Switched to Free");
    } else {
      toast.success(
        `${PLAN_DETAILS[p].nameKa} გააქტიურდა · ${PLAN_DETAILS[p].name} activated`,
      );
    }
    onOpenChange(false);
  };

  const headline =
    reason === "swipe_limit"
      ? {
          ka: "მიაღწიე უფასო ლიმიტს",
          en: "You've hit the free swipe limit",
          sub: "განაახლეთ ტარიფი შეუზღუდავი მატჩებისთვის · Upgrade for unlimited matching",
        }
      : reason === "ai_best_fit"
        ? {
            ka: "AI Best Fit მხოლოდ Plus და Ultra-სთვის",
            en: "AI Best Fit is exclusive to Plus & Ultra",
            sub: "ეს ფუნქცია ხელმისაწვდომია მხოლოდ Plus და Ultra წევრებისთვის. განაახლეთ ტარიფი! · This feature is exclusive to Plus & Ultra members. Upgrade now!",
          }
        : {
            ka: "აირჩიე შენი ტარიფი",
            en: "Choose your plan",
            sub: "გადართე ნებისმიერ დროს · Switch any time",
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

        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {(Object.keys(PLAN_DETAILS) as Plan[]).map((p) => {
            const d = PLAN_DETAILS[p];
            const Icon = ICONS[p];
            const isCurrent = plan === p;
            const isHighlight = p === "plus";
            return (
              <div
                key={p}
                className={[
                  "relative flex flex-col rounded-xl border p-5",
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
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-display text-base font-semibold">{d.name}</div>
                    <div className="text-[11px] text-muted-foreground">{d.nameKa}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <span className="font-display text-3xl font-bold">{d.price}</span>
                  <span className="ml-1 text-sm text-muted-foreground">GEL / mo</span>
                </div>
                <ul className="mt-3 flex-1 space-y-1.5 text-sm">
                  {PLAN_FEATURES[p].en.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>
                        {f}
                        <span className="block text-[11px] text-muted-foreground">
                          {PLAN_FEATURES[p].ka[i]}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-4 w-full"
                  variant={isCurrent ? "outline" : isHighlight ? "default" : "secondary"}
                  onClick={() => pick(p)}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? "მიმდინარე ტარიფი · Current plan"
                    : p === "free"
                      ? "Free-ზე გადასვლა · Switch to Free"
                      : `განაახლეთ ტარიფი · Upgrade`}
                </Button>
              </div>
            );
          })}
        </div>

        {reason === "swipe_limit" && (
          <div className="mt-2 text-center text-xs text-muted-foreground">
            ან დაბრუნდი დაფაზე · or return to dashboard to keep browsing your existing matches
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
