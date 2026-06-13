import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
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
import {
  defaultProfile,
  useProfile,
  type SleepSchedule,
  type StudentProfile,
} from "@/lib/student-store";
import { ArrowLeft, ArrowRight, Check, Upload, ShieldCheck, FileText } from "lucide-react";

const GE_UNIVERSITIES: { value: string; label: string }[] = [
  { value: "თბილისის სახელმწიფო უნივერსიტეტი (TSU)", label: "თბილისის სახელმწიფო უნივერსიტეტი (TSU)" },
  { value: "ილიას სახელმწიფო უნივერსიტეტი (Iliauni)", label: "ილიას სახელმწიფო უნივერსიტეტი (Iliauni)" },
  { value: "საქართველოს ტექნიკური უნივერსიტეტი (GTU)", label: "საქართველოს ტექნიკური უნივერსიტეტი (GTU)" },
  { value: "თავისუფალი უნივერსიტეტი (Freeuni)", label: "თავისუფალი უნივერსიტეტი (Freeuni)" },
  { value: "ბიზნესისა და ტექნოლოგიების უნივერსიტეტი (BTU)", label: "ბიზნესისა და ტექნოლოგიების უნივერსიტეტი (BTU)" },
  { value: "ქუთაისის საერთაშორისო უნივერსიტეტი (KIU)", label: "ქუთაისის საერთაშორისო უნივერსიტეტი (KIU)" },
  { value: "შავი ზღვის საერთაშორისო უნივერსიტეტი (IBSU)", label: "შავი ზღვის საერთაშორისო უნივერსიტეტი (IBSU)" },
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
  const { t } = useI18n();
  const navigate = useNavigate();
  const { save } = useProfile();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>(defaultProfile);
  const [studentIdName, setStudentIdName] = useState<string | null>(null);

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
            <StudentIdUpload
              fileName={studentIdName}
              onFile={(name) => {
                setStudentIdName(name);
                update("verified", true);
              }}
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

/* -------- Student ID upload (drag & drop simulator) -------- */
export function StudentIdUpload({
  fileName,
  onFile,
}: {
  fileName: string | null;
  onFile: (name: string) => void;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (f) onFile(f.name);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          ვერიფიკაცია / Student Verification
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          ატვირთეთ სტუდენტური ბარათი ან ცნობა — ჰოსტებს ეძლევათ გარანტია, რომ ხართ ვერიფიცირებული უნივერსიტეტის სტუდენტი.
          <br />
          <span className="text-xs">Upload a Student ID or enrollment letter — hosts trust verified university students.</span>
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={[
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all",
          drag
            ? "border-emerald-500 bg-emerald-500/10"
            : fileName
              ? "border-emerald-500/60 bg-emerald-500/5"
              : "border-border bg-card hover:border-accent/60",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {fileName ? (
          <>
            <ShieldCheck className="h-10 w-10 text-emerald-500" />
            <div className="mt-3 font-display text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Verified Student
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />
              {fileName}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">Tap to replace</div>
          </>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="mt-3 font-medium">
              ატვირთეთ სტუდენტური ბარათი ან ცნობა
            </div>
            <div className="text-sm text-muted-foreground">Upload Student ID</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Drag & drop or click to browse · JPG, PNG, PDF
            </div>
          </>
        )}
      </div>

      <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-emerald-500" />
        Your document is encrypted end-to-end and only used to issue the green
        <span className="font-semibold"> "Verified Student"</span> badge on your match cards.
      </div>
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
  const isPreset = useMemo(
    () => GE_UNIVERSITIES.some((u) => u.value === value),
    [value],
  );
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
