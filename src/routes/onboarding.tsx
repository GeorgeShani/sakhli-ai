import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useI18n } from "@/lib/i18n";
import {
  defaultProfile,
  useProfile,
  type SleepSchedule,
  type StudentProfile,
  type SalaryBracket,
  type IncomeSource,
  SALARY_RANGES,
  INCOME_SOURCE_LABEL,
  INCOME_SOURCE_LABEL_KA,
} from "@/lib/student-store";
import { ArrowLeft, ArrowRight, Check, Wallet, Briefcase } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — SakhliAI" },
      { name: "description", content: "Build your student profile in 2 minutes." },
    ],
  }),
  component: OnboardingPage,
});

const TOTAL = 8;

function OnboardingPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);

  const update = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const next = () => {
    if (step < TOTAL - 1) setStep(step + 1);
    else {
      save(profile);
      navigate({ to: "/matches" });
    }
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const sleepOption = (v: SleepSchedule, label: string) => (
    <button
      key={v}
      type="button"
      onClick={() => update("sleep", v)}
      className={[
        "rounded-xl border p-4 text-left transition-all",
        profile.sleep === v
          ? "border-accent bg-accent/10 ring-2 ring-accent/40"
          : "border-border bg-card hover:border-accent/40",
      ].join(" ")}
    >
      <div className="font-medium">{label}</div>
    </button>
  );

  const habitToggle = (
    field: "smoking" | "pets" | "parties" | "quiet",
    label: string,
  ) => (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <Label htmlFor={field} className="cursor-pointer text-sm">{label}</Label>
      <Switch id={field} checked={profile[field]} onCheckedChange={(v) => update(field, v)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">{t("onboarding.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t("onboarding.step")} {step + 1} {t("onboarding.of")} {TOTAL}
            </span>
            <span>{Math.round(((step + 1) / TOTAL) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        <div className="card-elevated mt-8 p-6 md:p-8">
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">{t("onboarding.q1.title")}</h2>
              <div className="space-y-2">
                <Label>{t("onboarding.q1.name")}</Label>
                <Input
                  value={profile.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Nino"
                />
              </div>
              <div className="space-y-2">
                <Label>{t("onboarding.q1.label")}</Label>
                <Input
                  value={profile.university}
                  onChange={(e) => update("university", e.target.value)}
                  placeholder={t("onboarding.q1.placeholder")}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold">{t("onboarding.q2.title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("onboarding.q2.desc")}</p>
              </div>
              <div className="text-center font-display text-4xl font-bold text-gradient">
                ₾ {profile.budget}
              </div>
              <Slider
                value={[profile.budget]}
                min={300}
                max={3000}
                step={50}
                onValueChange={([v]) => update("budget", v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₾ 300</span>
                <span>₾ 3,000</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">{t("onboarding.q3.title")}</h2>
              <div className="grid gap-3 sm:grid-cols-3">
                {sleepOption("early_bird", t("onboarding.q3.early"))}
                {sleepOption("night_owl", t("onboarding.q3.night"))}
                {sleepOption("flexible", t("onboarding.q3.flex"))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold">{t("onboarding.q4.title")}</h2>
              <div className="space-y-2">
                {habitToggle("smoking", t("onboarding.q4.smoking"))}
                {habitToggle("pets", t("onboarding.q4.pets"))}
                {habitToggle("parties", t("onboarding.q4.parties"))}
                {habitToggle("quiet", t("onboarding.q4.quiet"))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold">{t("onboarding.q5.title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("onboarding.q5.scale")}</p>
              </div>
              <div className="text-center font-display text-5xl font-bold text-gradient">
                {profile.cleanliness}
              </div>
              <Slider
                value={[profile.cleanliness]}
                min={1}
                max={5}
                step={1}
                onValueChange={([v]) => update("cleanliness", v)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-semibold">{t("onboarding.q6.title")}</h2>
              <Textarea
                rows={5}
                value={profile.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder={t("onboarding.q6.placeholder")}
              />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Wallet className="h-5 w-5 text-primary" />
                  ფინანსური პროფილი / Financial Profile
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Used by SakhliAI to calculate a safe rent-to-income ratio. Private — never shown to hosts.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  ყოველთვიური შემოსავალი / Monthly income (GEL)
                </Label>
                <RadioGroup
                  value={profile.salaryBracket}
                  onValueChange={(v) => update("salaryBracket", v as SalaryBracket)}
                  className="grid gap-2"
                >
                  {(Object.keys(SALARY_RANGES) as SalaryBracket[]).map((k) => (
                    <label
                      key={k}
                      htmlFor={`sal-${k}`}
                      className={[
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
                        profile.salaryBracket === k
                          ? "border-accent bg-accent/10 ring-2 ring-accent/40"
                          : "border-border bg-card hover:border-accent/40",
                      ].join(" ")}
                    >
                      <RadioGroupItem id={`sal-${k}`} value={k} />
                      <div className="flex-1">
                        <div className="font-medium">{SALARY_RANGES[k].label}</div>
                        <div className="text-xs text-muted-foreground">{SALARY_RANGES[k].labelKa}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-5">
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Briefcase className="h-5 w-5 text-primary" />
                  შემოსავლის წყარო / Income Source
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select all that apply. Helps us match you to financially compatible flatmates.
                </p>
              </div>

              <div className="grid gap-2">
                {(["job", "family", "scholarship"] as IncomeSource[]).map((k) => {
                  const checked = (profile.incomeSources ?? []).includes(k);
                  return (
                    <label
                      key={k}
                      htmlFor={`inc-${k}`}
                      className={[
                        "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all",
                        checked
                          ? "border-accent bg-accent/10 ring-2 ring-accent/40"
                          : "border-border bg-card hover:border-accent/40",
                      ].join(" ")}
                    >
                      <Checkbox
                        id={`inc-${k}`}
                        checked={checked}
                        onCheckedChange={(v) => {
                          const cur = new Set(profile.incomeSources ?? []);
                          if (v) cur.add(k);
                          else cur.delete(k);
                          const arr = Array.from(cur) as IncomeSource[];
                          update("incomeSources", arr.length ? arr : ["family"]);
                          update("incomeSource", (arr[0] ?? "family") as IncomeSource);
                        }}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{INCOME_SOURCE_LABEL_KA[k]}</div>
                        <div className="text-xs text-muted-foreground">{INCOME_SOURCE_LABEL[k]}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("onboarding.back")}
            </Button>
            <Button onClick={next}>
              {step === TOTAL - 1 ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t("onboarding.finish")}
                </>
              ) : (
                <>
                  {t("onboarding.next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
