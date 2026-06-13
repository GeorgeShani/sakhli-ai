import { useState } from "react";
import { Gavel, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

  const resolve = () => {
    if (!issue.trim()) return;
    setThinking(true);
    setVerdict(null);
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
        <Textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="მაგ: 'ჩემი flatmate არასოდეს რეცხავს ჭურჭელს' ან 'ხშირად ღამის 2 საათზე უსმენს მუსიკას'"
          rows={4}
        />
        <Button onClick={resolve} disabled={thinking || !issue.trim()}>
          {thinking ? (
            <>
              <Sparkles className="mr-1.5 h-4 w-4 animate-spin" /> AI ფიქრობს…
            </>
          ) : (
            <>
              <Gavel className="mr-1.5 h-4 w-4" /> გასცეს ვერდიქტი / Generate Verdict
            </>
          )}
        </Button>
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
