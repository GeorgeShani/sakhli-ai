import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useMatches, useProfile } from "@/lib/student-store";
import { flatmates, properties } from "@/lib/mock-data";
import { MessageCircle, Plus, Trash2, Users } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SakliAI" },
      { name: "description", content: "Your matches, utility splits, and chats." },
    ],
  }),
  component: DashboardPage,
});

type Tab = "matches" | "utilities" | "chat";

function DashboardPage() {
  const { t } = useI18n();
  const { profile } = useProfile();
  const { matches } = useMatches();
  const [tab, setTab] = useState<Tab>("matches");

  const likedPeople = matches
    .filter((m) => m.kind === "person" && m.liked)
    .map((m) => flatmates.find((f) => f.id === m.id))
    .filter(Boolean);

  const likedPlaces = matches
    .filter((m) => m.kind === "place" && m.liked)
    .map((m) => properties.find((p) => p.id === m.id))
    .filter(Boolean);

  const tabBtn = (v: Tab, label: string) => (
    <button
      onClick={() => setTab(v)}
      className={[
        "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        tab === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div>
          <h1 className="font-display text-3xl font-bold">
            {t("dashboard.title")}
            {profile?.name && <span className="text-muted-foreground"> · {profile.name}</span>}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        <div className="mt-6 flex rounded-lg border border-border bg-secondary p-1">
          {tabBtn("matches", t("dashboard.tab.matches"))}
          {tabBtn("utilities", t("dashboard.tab.utilities"))}
          {tabBtn("chat", t("dashboard.tab.chat"))}
        </div>

        <div className="mt-6">
          {tab === "matches" && (
            <div className="space-y-6">
              {likedPeople.length === 0 && likedPlaces.length === 0 ? (
                <div className="card-elevated p-10 text-center">
                  <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">{t("dashboard.matches.empty")}</p>
                  <Button asChild className="mt-4">
                    <Link to="/matches">{t("dashboard.matches.go")}</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {likedPeople.length > 0 && (
                    <section>
                      <h2 className="mb-3 font-display text-lg font-semibold">{t("matches.tab.people")}</h2>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {likedPeople.map((f) => f && (
                          <div key={f.id} className="card-elevated flex items-center gap-3 p-4">
                            <img src={f.avatar} alt={f.name} className="h-12 w-12 rounded-full bg-secondary" />
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{f.name}</div>
                              <div className="truncate text-xs text-muted-foreground">{f.university}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                  {likedPlaces.length > 0 && (
                    <section>
                      <h2 className="mb-3 font-display text-lg font-semibold">{t("matches.tab.places")}</h2>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {likedPlaces.map((p) => p && (
                          <div key={p.id} className="card-elevated overflow-hidden">
                            <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }} />
                            <div className="p-3">
                              <div className="truncate font-medium">{p.title}</div>
                              <div className="mt-0.5 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="truncate">{p.district}</span>
                                <span className="font-semibold text-foreground">₾{p.price}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </div>
          )}

          {tab === "utilities" && <UtilitySplitter />}
          {tab === "chat" && <ChatPanel matchedNames={likedPeople.map((f) => f!.name)} />}
        </div>
      </div>
    </div>
  );
}

type Bill = { id: string; name: string; amount: number };

function UtilitySplitter() {
  const { t } = useI18n();
  const [bills, setBills] = useState<Bill[]>([
    { id: "1", name: "Rent", amount: 2100 },
    { id: "2", name: "Internet", amount: 80 },
    { id: "3", name: "Electricity", amount: 140 },
  ]);
  const [people, setPeople] = useState(3);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const total = bills.reduce((s, b) => s + b.amount, 0);
  const perPerson = people > 0 ? total / people : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card-elevated p-6">
        <h2 className="font-display text-lg font-semibold">{t("utilities.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("utilities.desc")}</p>

        <div className="mt-5 space-y-2">
          {bills.map((b) => (
            <div key={b.id} className="flex items-center gap-2 rounded-lg border border-border bg-card p-3">
              <div className="flex-1 truncate font-medium">{b.name}</div>
              <div className="font-semibold">₾{b.amount.toFixed(2)}</div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setBills((bs) => bs.filter((x) => x.id !== b.id))}
                aria-label={t("utilities.remove")}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_140px_auto]">
          <Input placeholder={t("utilities.bill")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            type="number"
            placeholder={t("utilities.amount")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={() => {
              const n = name.trim();
              const a = parseFloat(amount);
              if (!n || !Number.isFinite(a) || a <= 0) return;
              setBills((bs) => [...bs, { id: crypto.randomUUID(), name: n, amount: a }]);
              setName("");
              setAmount("");
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            {t("utilities.add")}
          </Button>
        </div>
      </div>

      <div className="card-elevated h-fit p-6">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          {t("utilities.people")}
        </Label>
        <div className="mt-2 flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPeople((n) => Math.max(1, n - 1))}>−</Button>
          <div className="flex-1 text-center font-display text-2xl font-bold">{people}</div>
          <Button variant="outline" size="icon" onClick={() => setPeople((n) => n + 1)}>+</Button>
        </div>

        <div className="mt-6 rounded-xl bg-gradient-to-br from-primary/90 to-primary p-5 text-primary-foreground">
          <div className="text-xs opacity-70">{t("utilities.total")}</div>
          <div className="font-display text-2xl font-bold">₾ {total.toFixed(2)}</div>
          <div className="mt-4 text-xs opacity-70">{t("utilities.perPerson")}</div>
          <div className="font-display text-3xl font-extrabold">₾ {perPerson.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

type Msg = { from: "me" | "them"; text: string };

function ChatPanel({ matchedNames }: { matchedNames: string[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(matchedNames[0] ?? null);
  const [thread, setThread] = useState<Record<string, Msg[]>>({});
  const [draft, setDraft] = useState("");

  if (matchedNames.length === 0) {
    return (
      <div className="card-elevated p-10 text-center">
        <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">{t("chat.empty")}</p>
      </div>
    );
  }

  const send = () => {
    if (!active || !draft.trim()) return;
    setThread((th) => ({
      ...th,
      [active]: [...(th[active] ?? []), { from: "me", text: draft.trim() }],
    }));
    setDraft("");
    setTimeout(() => {
      setThread((th) => ({
        ...th,
        [active]: [
          ...(th[active] ?? []),
          { from: "them", text: "Hey! Thanks for reaching out 🙂" },
        ],
      }));
    }, 700);
  };

  const messages = active ? thread[active] ?? [] : [];

  return (
    <div className="grid gap-3 md:grid-cols-[220px_1fr]">
      <div className="card-elevated h-fit p-2">
        {matchedNames.map((n) => (
          <button
            key={n}
            onClick={() => setActive(n)}
            className={[
              "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
              active === n ? "bg-secondary font-medium" : "hover:bg-secondary/60",
            ].join(" ")}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="card-elevated flex h-[440px] flex-col">
        <div className="border-b border-border px-4 py-3 font-medium">{active}</div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="text-center text-xs text-muted-foreground">{t("chat.title")}</div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={[
                "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                m.from === "me"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              ].join(" ")}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border p-3">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("chat.placeholder")}
          />
          <Button onClick={send}>{t("chat.send")}</Button>
        </div>
      </div>
    </div>
  );
}
