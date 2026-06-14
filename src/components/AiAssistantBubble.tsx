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
    "How does the SakhliAI hybrid revenue model benefit me?",
  ],
  ka: [
    "როგორ შევამცირო ზამთრის გაზის გადასახადი?",
    "რომელია ყველაზე უსაფრთხო სტუდენტური უბანი თბილისში?",
    "როგორ მეხმარება SakhliAI-ის ჰიბრიდული გაქირავების მოდელი?",
  ],
};

type Msg = { role: "ai" | "user"; text: string };

function contextGreeting(path: string, role: string | null | undefined, locale: "en" | "ka"): string {
  const en = {
    host: "Hi host! 🏠 I can help with pricing, booking status, or channel sync.",
    matches: "Ready to surface your most compatible flatmate — try the AI Best Fit filter!",
    dashboard: "From your dashboard I can split bills, optimize your budget, or check your contract.",
    onboarding: "Let's finish your profile — the more precise it is, the better your matches. 🎯",
    defHost: "I'm the SakhliAI assistant — I can share rental market trends across Georgia.",
    defStudent: "I'm the SakhliAI assistant — I'll help you pick a home, flatmate, or budget.",
  };
  const ka = {
    host: "გამარჯობა მასპინძელო! 🏠 დაგეხმარები ფასების ოპტიმიზაციაში, დაჯავშნების სტატუსში ან არხების სინქრონიზაციაში.",
    matches: "მზად ვარ შემოგთავაზო ყველაზე თავსებადი თანამცხოვრები. სცადე AI Best Fit ფილტრი!",
    dashboard: "შენი დაფიდან შემიძლია გავყო კომუნალური, შემოგთავაზო ბიუჯეტის ოპტიმიზაცია ან ხელშეკრულების სტატუსი.",
    onboarding: "გავაგრძელოთ შენი პროფილი — რაც უფრო ზუსტია, მით უკეთესია მატჩები. 🎯",
    defHost: "მე ვარ SakhliAI ასისტენტი — შემიძლია გითხრა ბაზრის ტრენდები საქართველოში.",
    defStudent: "მე ვარ SakhliAI ასისტენტი — დაგეხმარები ბინის, თანამცხოვრებლის ან ბიუჯეტის შერჩევაში.",
  };
  const d = locale === "ka" ? ka : en;
  if (path.startsWith("/host")) return d.host;
  if (path.startsWith("/matches")) return d.matches;
  if (path.startsWith("/dashboard")) return d.dashboard;
  if (path.startsWith("/onboarding")) return d.onboarding;
  return role === "host" ? d.defHost : d.defStudent;
}

/** Per-page suggested questions, with the evergreen templates as fallback. */
function contextChips(path: string, locale: "en" | "ka"): string[] {
  if (path.startsWith("/host")) {
    return locale === "ka"
      ? ["რა ფასი დავაწესო ვაკეში?", "როგორ მუშაობს არხების სინქრონიზაცია?", ...TEMPLATES.ka.slice(2)]
      : ["What price should I set in Vake?", "How does channel sync work?", ...TEMPLATES.en.slice(2)];
  }
  if (path.startsWith("/matches")) {
    return locale === "ka"
      ? ["როგორ მუშაობს AI Best Fit?", "რომელია უსაფრთხო უბანი?", ...TEMPLATES.ka.slice(2)]
      : ["How does AI Best Fit work?", "Which neighborhood is safest?", ...TEMPLATES.en.slice(2)];
  }
  if (path.startsWith("/dashboard")) {
    return locale === "ka"
      ? ["როგორ იყოფა გადასახადები?", "ხელშეკრულება ვალიდურია?", ...TEMPLATES.ka.slice(0, 1)]
      : ["How are bills split?", "Is the lease legally valid?", ...TEMPLATES.en.slice(0, 1)];
  }
  return TEMPLATES[locale];
}

function autoReply(q: string, path: string, role: string | null | undefined, locale: "en" | "ka"): string {
  const s = q.toLowerCase();
  const ka = locale === "ka";
  const pick = (en: string, k: string) => (ka ? k : en);

  if (s.includes("winter gas") || s.includes("gas utility") || s.includes("გაზის გადასახ") || s.includes("ზამთრის გაზ"))
    return pick(
      "🔥 SakhliAI uses historical insulation data per building and smart n8n alert triggers to recommend lower thermostat schedules during off-peak hours. Flatmates typically save up to 25% on winter gas bills without losing comfort.",
      "🔥 SakhliAI იყენებს ისტორიულ თბოიზოლაციის მონაცემებს და n8n-ის ჭკვიან გაფრთხილებებს ოპტიმალური თერმოსტატის გრაფიკისთვის — ეს ამცირებს ზამთრის გაზის გადასახადს 25%-მდე.",
    );

  if (s.includes("safest") || s.includes("safe student") || s.includes("neighborhood") || s.includes("უსაფრთხო") || s.includes("უბანი"))
    return pick(
      "🛡️ The safest student neighborhoods in Tbilisi are Saburtalo and Vake — high university density, active public transport, and street-lighting we monitor via the SakhliAI safety scorecard.",
      "🛡️ ყველაზე უსაფრთხო სტუდენტური უბნებია საბურთალო და ვაკე — უნივერსიტეტების მაღალი კონცენტრაცია, აქტიური ტრანსპორტი და განათება, რომელსაც ვაკონტროლებთ SakhliAI Safety Scorecard-ით.",
    );

  if (s.includes("hybrid") || s.includes("ჰიბრიდულ"))
    return pick(
      "💸 SakhliAI's hybrid model shifts long-term student contracts into short-term Airbnb listings in summer. Hosts see ~2.5x yield uplift, while student rent stays fixed through the academic year.",
      "💸 SakhliAI-ის ჰიბრიდული მოდელი: ზაფხულში გრძელვადიანი სტუდენტური კონტრაქტები გადადის მოკლევადიან Airbnb რეჟიმში — მასპინძლის შემოსავალი იზრდება 2.5x, სტუდენტის ქირა კი ფიქსირებულია.",
    );

  if (s.includes("price") || s.includes("rent") || s.includes("ფას"))
    return path.startsWith("/host")
      ? pick(
          "Median rent for similar flats in Vake is ₾1,650. Recommendation: set ₾1,720 — demand is high.",
          "ვაკეში მსგავსი ბინების მედიანა ₾1,650-ია. რეკომენდაცია: დააწესე ₾1,720 — მოთხოვნა მაღალია.",
        )
      : pick(
          "For your budget (₾1,200–1,600) the best options are in Saburtalo. Try the AI Best Fit filter.",
          "შენი ბიუჯეტისთვის (₾1,200–1,600) საუკეთესო ვარიანტებია საბურთალოზე. სცადე AI Best Fit ფილტრი.",
        );
  if (s.includes("budget") || s.includes("ბიუჯ"))
    return pick(
      "Median in Vake is ₾1,500/mo for students. Split across 2 flatmates → ₾750 each. 💡",
      "სტუდენტებისთვის ვაკეს მედიანა ₾1,500/თვე. გავყოთ 2 თანამცხოვრებზე — გამოვა ₾750. 💡",
    );
  if (s.includes("contract") || s.includes("lease") || s.includes("ხელშეკრ"))
    return pick(
      "Our digital smart contract is signed via SakhliAI Vault — legally valid in Georgia.",
      "ჩვენი ციფრული ხელშეკრულება ფორმდება SakhliAI Vault-ით — იურიდიულად ვალიდურია საქართველოში.",
    );
  if (s.includes("booking") || s.includes("channel") || s.includes("sync") || s.includes("ჯავშ") || s.includes("არხ"))
    return pick(
      "Your channels (Airbnb, Booking.com, Direct) sync in real time via n8n — any new booking appears on the calendar in ≤2s.",
      "შენი არხები (Airbnb, Booking.com, Direct) რეალურ დროში სინქრონიზდება n8n-ით. ახალი ჯავშანი ჩანს კალენდარზე ≤2 წამში.",
    );
  if (s.includes("hello") || s.includes("hi ") || s.includes("გამარჯ"))
    return contextGreeting(path, role, locale);
  return pick(
    "Good question! 🤔 My data says it depends on the district and season. Give me a few specifics and I'll give you an exact recommendation.",
    "კარგი კითხვაა! 🤔 ეს დამოკიდებულია უბანზე და სეზონზე. დააკონკრეტე და მოგცემ ზუსტ რეკომენდაციას.",
  );
}

export function AiAssistantBubble() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { profile } = useAuth();
  const { locale, t } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role: "ai", text: contextGreeting(path, profile?.role, locale) }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  // Reveal the reply word-by-word, like a streaming model.
  const streamReply = (full: string) => {
    const words = full.split(" ");
    setMsgs((m) => [...m, { role: "ai", text: "" }]);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "ai", text: words.slice(0, i).join(" ") };
        return copy;
      });
      if (i >= words.length) window.clearInterval(id);
    }, 28);
  };

  const ask = (text: string) => {
    if (typing) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setTyping(true);
    const reply = autoReply(text, path, profile?.role, locale);
    window.setTimeout(() => {
      setTyping(false);
      streamReply(reply);
    }, 700);
  };

  const send = () => {
    const text = input.trim();
    if (!text) return;
    ask(text);
    setInput("");
  };

  const chips = contextChips(path, locale);

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
                <div className="text-sm font-semibold leading-tight">{t("assistant.name")}</div>
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
                    "max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "ai"
                      ? "bg-secondary text-foreground rounded-bl-sm"
                      : "bg-primary text-primary-foreground rounded-br-sm",
                  ].join(" ")}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-secondary px-3 py-2.5">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t border-border bg-background/30 p-2">
            {chips.map((q) => (
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
              placeholder={t("assistant.placeholder")}
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
