import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const TEMPLATES: Record<"en" | "ka", string[]> = {
  en: [
    "How can I reduce my winter gas utility bill?",
    "What is the safest student neighborhood in Tbilisi?",
    "How does the SakliAI hybrid revenue model benefit me?",
  ],
  ka: [
    "როგორ შევამცირო ზამთრის გაზის გადასახადი?",
    "რომელია ყველაზე უსაფრთხო სტუდენტური უბანი თბილისში?",
    "როგორ მეხმარება SakliAI-ის ჰიბრიდული გაქირავების მოდელი?",
  ],
};

type Msg = { role: "ai" | "user"; text: string };

function contextGreeting(path: string, role?: string | null): string {
  if (path.startsWith("/host"))
    return "გამარჯობა მასპინძელო! 🏠 დაგეხმარები ფასების ოპტიმიზაციაში, დაჯავშნების სტატუსში ან არხების სინქრონიზაციაში.";
  if (path.startsWith("/matches"))
    return "მზად ვარ შემოგთავაზო ყველაზე თავსებადი თანამცხოვრები. სცადე AI Best Fit ფილტრი!";
  if (path.startsWith("/dashboard"))
    return "შენი დაფიდან შემიძლია გავყო კომუნალური, შემოგთავაზო ბიუჯეტის ოპტიმიზაცია ან ხელშეკრულების სტატუსი.";
  if (path.startsWith("/onboarding"))
    return "გავაგრძელოთ შენი პროფილი — რაც უფრო ზუსტია, მით უკეთესია მატჩები. 🎯";
  return role === "host"
    ? "მე ვარ SakhliAI ასისტენტი — შემიძლია გითხრა ბაზრის ტრენდები საქართველოში."
    : "მე ვარ SakhliAI ასისტენტი — დაგეხმარები ბინის, თანამცხოვრებლის ან ბიუჯეტის შერჩევაში.";
}

function autoReply(q: string, path: string, role?: string | null): string {
  const s = q.toLowerCase();
  if (s.includes("ფას") || s.includes("price") || s.includes("rent"))
    return path.startsWith("/host")
      ? "ვაკეში მსგავსი ბინების მედიანა არის ₾1,650. რეკომენდაცია: დააწესე ₾1,720 — მოთხოვნა მაღალია."
      : "შენი ბიუჯეტისთვის (₾1,200–1,600) საუკეთესო ვარიანტებია საბურთალოზე. სცადე AI Best Fit ფილტრი.";
  if (s.includes("ბიუჯ") || s.includes("budget"))
    return "სტუდენტებისთვის ვაკეს მედიანა ₾1,500/თვე. გავყოთ 2 თანამცხოვრებზე — გამოვა ₾750. 💡";
  if (s.includes("ხელშეკრ") || s.includes("contract") || s.includes("lease"))
    return "ჩვენი ციფრული Smart Contract ხელმოწერა ხდება SakhliAI Vault-ით — იურიდიულად ვალიდურია საქართველოში.";
  if (s.includes("booking") || s.includes("ჯავშ"))
    return "შენი არხები (Airbnb, Booking.com, Direct) რეალურ დროში სინქრონიზდება n8n-ით. ნებისმიერი ახალი ჯავშანი ჩანს კალენდარზე ≤2 წამში.";
  if (s.includes("hello") || s.includes("გამარჯ"))
    return contextGreeting(path, role);
  return "კარგი კითხვაა! 🤔 ჩემი მონაცემები მიუთითებს, რომ ეს დამოკიდებულია უბანზე და სეზონზე. დააკონკრეტე და მოგცემ ზუსტ რეკომენდაციას.";
}

export function AiAssistantBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useAuth();
  const { locale } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "ai", text: contextGreeting(path, profile?.role) }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const ask = (text: string) => {
    const reply = autoReply(text, path, profile?.role);
    setMsgs((m) => [...m, { role: "user", text }, { role: "ai", text: reply }]);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    ask(text);
    setInput("");
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_30px_-6px_color-mix(in_oklab,var(--accent)_60%,transparent)] transition-transform hover:scale-105"
          aria-label="Open SakhliAI Assistant"
        >
          <Bot className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative h-3 w-3 rounded-full bg-accent" />
          </span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[480px] w-[340px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
          <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-primary/10 via-accent/10 to-transparent px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-tight">SakhliAI ასისტენტი</div>
                <div className="text-[10px] text-muted-foreground">context: {path}</div>
              </div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "ai" ? "flex justify-start" : "flex justify-end"}>
                <div
                  className={[
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.role === "ai"
                      ? "bg-secondary text-foreground rounded-bl-sm"
                      : "bg-primary text-primary-foreground rounded-br-sm",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border bg-background/30 p-2">
            {TEMPLATES[locale].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="truncate rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] text-foreground transition-colors hover:bg-primary/10"
                title={q}
              >
                {q}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-border bg-background/50 p-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="ჰკითხე SakhliAI-ს…"
              className="h-9 flex-1"
            />
            <Button size="icon" onClick={send}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
