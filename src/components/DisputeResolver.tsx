import { useState } from "react";
import { Gavel, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AgentThinking } from "@/components/agent/AgentThinking";
import { useProfile } from "@/lib/student-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function generateVerdict(issue: string): string {
  const s = issue.toLowerCase();
  if (s.includes("noise") || s.includes("ხმაურ") || s.includes("party"))
    return "🎧 AI კომპრომისი: ღამის 23:00-დან 08:00-მდე ხმაური მინიმუმამდე. შაბათობით — გამონაკლისი 01:00-მდე. (და დიახ, ერთიც კი დღეში — სიჩუმის სასწაული!) წყაროდ მითითებულია ორივეს onboarding ჩვევები.";
  if (s.includes("clean") || s.includes("dish") || s.includes("ჭურჭ") || s.includes("ჭუჭყ"))
    return "🧹 AI კომპრომისი: სამზარეულოს ჭურჭელი — 12 საათში. გენერალური დასუფთავება — როტაცია ყოველ კვირას (cleanliness score ჩვენებს, ვინ უნდა იყოს მენტორი 😉).";
  if (s.includes("bill") || s.includes("გადასახ") || s.includes("ქირა") || s.includes("rent"))
    return "💸 AI კომპრომისი: გადასახადები გაიყოს დღეების მიხედვით (move-in date weighted). საერთო ხარჯები — თანაბრად. იხილე 'Utility Splitter' tab-ი — უკვე ავტომატურია.";
  if (s.includes("pet") || s.includes("ცხოვ"))
    return "🐾 AI კომპრომისი: შინაური ცხოველი იყოს მხოლოდ ერთ ოთახში. ალერგიულ flatmate-ს — საერთო სივრცე თავისუფალი 2 სთ/დღეში. (ცხოველს ჰკითხონ — ალბათ თანახმაა.)";
  if (s.includes("guest") || s.includes("სტუმ"))
    return "👋 AI კომპრომისი: სტუმრები კვირაში 3-ჯერ მაქს. ღამის სტუმარი — 24 სთ წინასწარი შეტყობინებით. (და კი, ეს უკეთესია, ვიდრე passive-aggressive Post-it ცომზე.)";
  return "🤝 AI კომპრომისი: ორივე მხარემ ჩაატაროს 10-წუთიანი 'sync' შაბათობით. შეთანხმდით 1 კონკრეტულ წესზე და დააფიქსირეთ ხელშეკრულებაში. დავა გადაჭრილია — წინ ვარდი, უკან ეკალი. 🌹";
}

export function DisputeResolver() {
  const [open, setOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [verdict, setVerdict] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const { profile } = useProfile();

  const resolve = async () => {
    if (!issue.trim()) return;
    setThinking(true);
    setVerdict(null);

    const webhookUrl = import.meta.env.VITE_N8N_MEDIATE_URL;
    if (webhookUrl) {
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            issue,
            conflictDescription: issue, // 100% compatibility with n8n prompt variables!
            user1: {
              name: profile?.name || "Nino Kobakhidze",
              sleep: profile?.sleep || "night_owl",
              cleanliness: profile?.cleanliness || 4,
              smoking: profile?.smoking || false,
              pets: profile?.pets || false,
              parties: profile?.parties || false,
              quiet: profile?.quiet || true,
            },
            user2: {
              name: "Giorgi Meladze",
              sleep: "early_bird",
              cleanliness: 3,
              smoking: false,
              pets: false,
              parties: true,
              quiet: false,
            }
          }),
        });
        if (res.ok) {
          const data = await res.json();
          const verdictText = data.verdict || data.text || data.output || (typeof data === "string" ? data : JSON.stringify(data));
          setVerdict(verdictText);
          setThinking(false);
          return;
        }
      } catch (err) {
        console.warn("Error calling n8n mediator, falling back to local simulation", err);
      }
    }

    // Local fallback
    setTimeout(() => {
      setVerdict(generateVerdict(issue));
      setThinking(false);
    }, 900);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setVerdict(null); setIssue(""); } }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-accent/40 bg-accent/5 hover:bg-accent/10">
          <Gavel className="mr-2 h-4 w-4 text-accent" />
          მოაგვარე უთანხმოება AI-ით / Resolve Dispute via AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" /> AI House Rules Mediator
          </DialogTitle>
          <DialogDescription>
            აღწერე კონფლიქტი — AI გააანალიზებს თქვენი onboarding-ის ჩვევებს და გასცემს სამართლიან, ბალანსირებულ (და ცოტა იუმორიან) გადაწყვეტილებას.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-1.5">
          {[
            { label: "🎧 Noise", v: "My flatmate plays music late at night" },
            { label: "🧹 Cleaning", v: "Dishes are never washed" },
            { label: "💸 Bills", v: "We disagree on how to split bills" },
            { label: "🐾 Pets", v: "A flatmate wants a pet but I'm allergic" },
            { label: "👋 Guests", v: "Too many overnight guests" },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setIssue(c.v)}
              className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs transition-colors hover:border-accent/50 hover:bg-accent/10"
            >
              {c.label}
            </button>
          ))}
        </div>
        <Textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="მაგ: 'ჩემი flatmate არასოდეს რეცხავს ჭურჭელს' ან 'ხშირად ღამის 2 საათზე უსმენს მუსიკას'"
          rows={4}
        />
        <Button onClick={resolve} disabled={thinking || !issue.trim()}>
          <Gavel className="mr-1.5 h-4 w-4" /> გასცეს ვერდიქტი / Generate Verdict
        </Button>
        {thinking && (
          <div className="flex justify-center py-2">
            <AgentThinking label="SakhliAI mediator is weighing both sides…" />
          </div>
        )}
        {verdict && (
          <div className="animate-fade-in rounded-xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-accent/10 p-4 text-sm leading-relaxed">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              ⚖️ SakhliAI Mediator
            </div>
            {verdict}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
