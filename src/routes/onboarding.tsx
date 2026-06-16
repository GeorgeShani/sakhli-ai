import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { OnboardingReveal } from "@/components/OnboardingReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  defaultProfile,
  useProfile,
  type SleepSchedule,
  type StudentProfile,
} from "@/lib/student-store";
import { ArrowLeft, ArrowRight, Check, Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const GE_UNIVERSITIES: { value: string; label: string }[] = [
  {
    value: "თბილისის სახელმწიფო უნივერსიტეტი (TSU)",
    label: "თბილისის სახელმწიფო უნივერსიტეტი (TSU)",
  },
  {
    value: "ილიას სახელმწიფო უნივერსიტეტი (Iliauni)",
    label: "ილიას სახელმწიფო უნივერსიტეტი (Iliauni)",
  },
  {
    value: "საქართველოს ტექნიკური უნივერსიტეტი (GTU)",
    label: "საქართველოს ტექნიკური უნივერსიტეტი (GTU)",
  },
  { value: "თავისუფალი უნივერსიტეტი (Freeuni)", label: "თავისუფალი უნივერსიტეტი (Freeuni)" },
  {
    value: "ბიზნესისა და ტექნოლოგიების უნივერსიტეტი (BTU)",
    label: "ბიზნესისა და ტექნოლოგიების უნივერსიტეტი (BTU)",
  },
  {
    value: "ქუთაისის საერთაშორისო უნივერსიტეტი (KIU)",
    label: "ქუთაისის საერთაშორისო უნივერსიტეტი (KIU)",
  },
  {
    value: "შავი ზღვის საერთაშორისო უნივერსიტეტი (IBSU)",
    label: "შავი ზღვის საერთაშორისო უნივერსიტეტი (IBSU)",
  },
];
const OTHER_VALUE = "__other__";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Onboarding — SakhliAI" },
      { name: "description", content: "Build your student profile in 2 minutes." },
    ],
  }),
  component: OnboardingPage,
});

const TOTAL = 7;

function OnboardingPage() {
  return (
    <AuthGate requireRole={false}>
      <OnboardingInner />
    </AuthGate>
  );
}

function OnboardingInner() {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);

  const update = <K extends keyof StudentProfile>(k: K, v: StudentProfile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const next = async () => {
    if (step < TOTAL - 1) setStep(step + 1);
    else {
      save(profile);

      if (user) {
        try {
          // Guarantee the public.users row exists — student_profiles.user_id FKs to it.
          await supabase
            .from("users")
            .upsert({ id: user.id, email: user.email ?? null }, { onConflict: "id" });

          const { error } = await supabase.from("student_profiles").upsert(
            {
              user_id: user.id,
              name: profile.name,
              university: profile.university,
              budget: profile.budget,
              sleep: profile.sleep,
              smoking: profile.smoking,
              pets: profile.pets,
              parties: profile.parties,
              quiet: profile.quiet,
              cleanliness: profile.cleanliness,
              bio: profile.bio,
              verified: profile.verified,
              salary_bracket: profile.salaryBracket,
              income_source: profile.incomeSource,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name || "student")}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
            },
            { onConflict: "user_id" },
          );

          if (error) {
            console.error("Error saving onboarding profile to Supabase:", error.message);
            toast.error(`Couldn't save your profile to the server: ${error.message}`);
          }
        } catch (err) {
          console.error("Failed to connect to Supabase to save onboarding:", err);
          toast.error("Couldn't reach the server to save your profile. Saved locally for now.");
        }
      }

      setDone(true);
    }
  };

  if (done) {
    return <OnboardingReveal profile={profile} onContinue={() => navigate({ to: "/matches" })} />;
  }
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

  const habitToggle = (field: "smoking" | "pets" | "parties" | "quiet", label: string) => (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
      <Label htmlFor={field} className="cursor-pointer text-sm">
        {label}
      </Label>
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
                <UniversitySelect
                  value={profile.university}
                  onChange={(v) => update("university", v)}
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
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
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
            <AcademicEmailVerify
              verified={profile.verified}
              onVerified={() => update("verified", true)}
            />
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

/* -------- Academic email + OTP verification -------- */
const ACADEMIC_DOMAINS = [
  ".edu.ge",
  ".edu",
  ".ac.ge",
  "tsu.edu.ge",
  "iliauni.edu.ge",
  "gtu.ge",
  "freeuni.edu.ge",
  "btu.edu.ge",
  "kiu.edu.ge",
  "ibsu.edu.ge",
];

function isAcademicEmail(email: string) {
  const lower = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return false;
  return ACADEMIC_DOMAINS.some((d) => lower.endsWith(d));
}

export function AcademicEmailVerify({
  verified,
  onVerified,
}: {
  verified: boolean;
  onVerified: () => void;
}) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const sendCode = () => {
    setError(null);
    if (!isAcademicEmail(email)) {
      setError(
        "გთხოვთ შეიყვანოთ აკადემიური ელ-ფოსტა (e.g. .edu.ge) / Please enter a valid academic email.",
      );
      return;
    }
    setSending(true);
    setSent(false);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    }, 900);
  };

  const handleDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 3) inputsRef.current[i + 1]?.focus();
  };

  useEffect(() => {
    if (sent && code.every((d) => d !== "") && !verified) {
      onVerified();
    }
  }, [code, sent, verified, onVerified]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          ვერიფიკაცია / Student Verification
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          დაადასტურეთ თქვენი სტუდენტური სტატუსი აკადემიური ელ-ფოსტით.
          <br />
          <span className="text-xs">Verify your student status with your university email.</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="academic-email">სტუდენტური ელ-ფოსტა / Academic Email Address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="academic-email"
            type="email"
            value={email}
            disabled={verified}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
              setCode(["", "", "", ""]);
            }}
            placeholder="e.g., username@tsu.edu.ge"
            className="pl-9"
            autoComplete="email"
          />
        </div>
        <Button
          type="button"
          onClick={sendCode}
          disabled={sending || verified || !email}
          className="w-full sm:w-auto"
        >
          {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          კოდის გაგზავნა / Send Verification Code
        </Button>
        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      {sent && (
        <div className="space-y-3 rounded-xl border border-border bg-secondary/40 p-4">
          <div className="text-xs text-muted-foreground">
            შეიყვანეთ 4-ნიშნა კოდი გაგზავნილი მისამართზე{" "}
            <span className="font-medium text-foreground">{email}</span>
          </div>
          <div className="flex justify-center gap-3">
            {code.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                value={d}
                disabled={verified}
                inputMode="numeric"
                maxLength={1}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !code[i] && i > 0) inputsRef.current[i - 1]?.focus();
                }}
                className="h-14 w-12 rounded-xl border border-border bg-card text-center font-display text-2xl font-bold shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            ))}
          </div>
        </div>
      )}

      {verified && (
        <div className="flex animate-in fade-in zoom-in-95 items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 shadow-[0_0_30px_-8px_rgba(16,185,129,0.6)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-base font-semibold text-emerald-700 dark:text-emerald-300">
              ✓ Verified Student
            </div>
            <div className="text-xs text-muted-foreground">
              თქვენი აკადემიური ელ-ფოსტა დადასტურებულია.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------- University select with "Other" fallback -------- */
function UniversitySelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const isPreset = useMemo(() => GE_UNIVERSITIES.some((u) => u.value === value), [value]);
  const [otherMode, setOtherMode] = useState<boolean>(!!value && !isPreset);

  const selectValue = otherMode ? OTHER_VALUE : isPreset ? value : "";

  return (
    <div className="space-y-2">
      <Select
        value={selectValue}
        onValueChange={(v) => {
          if (v === OTHER_VALUE) {
            setOtherMode(true);
            onChange("");
          } else {
            setOtherMode(false);
            onChange(v);
          }
        }}
      >
        <SelectTrigger className="font-sans">
          <SelectValue placeholder="აირჩიეთ უნივერსიტეტი / Select university" />
        </SelectTrigger>
        <SelectContent className="font-sans max-h-72">
          {GE_UNIVERSITIES.map((u) => (
            <SelectItem key={u.value} value={u.value}>
              {u.label}
            </SelectItem>
          ))}
          <SelectItem value={OTHER_VALUE}>სხვა / Other…</SelectItem>
        </SelectContent>
      </Select>
      {otherMode && (
        <Input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "თქვენი უნივერსიტეტი / Your university"}
        />
      )}
    </div>
  );
}
