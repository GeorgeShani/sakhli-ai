import { useEffect, useRef, useState } from "react";
import type { Locale } from "./i18n";
import { supabase } from "@/integrations/supabase/client";

/**
 * SakhliAI agent activity stream.
 *
 * Connected to a real Supabase Realtime subscription on the `agent_events` table.
 * If no events are stored in the database, it falls back to a realistic local
 * simulation to ensure a self-contained, interactive presentation experience.
 */

export type AgentEventKind =
  | "match"
  | "split"
  | "screen"
  | "sync"
  | "cleaning"
  | "lock"
  | "contract"
  | "mediation";

/** Who performed the action — the AI agent or an n8n automation. */
export type AgentEventSource = "agent" | "n8n";

export type AgentEvent = {
  id: string;
  kind: AgentEventKind;
  source: AgentEventSource;
  title: string;
  detail: string;
  /** epoch ms */
  at: number;
};

type Localized = { en: string; ka: string };

type AgentEventTemplate = {
  kind: AgentEventKind;
  source: AgentEventSource;
  title: Localized;
  detail: Localized;
};

/** Which personas should see a given template in their feed. */
type Persona = "student" | "host" | "marketing";

const STUDENT_KINDS: AgentEventKind[] = ["match", "split", "contract", "mediation"];
const HOST_KINDS: AgentEventKind[] = ["sync", "cleaning", "lock", "screen"];

const TEMPLATES: AgentEventTemplate[] = [
  {
    kind: "match",
    source: "agent",
    title: { en: "New compatible match", ka: "ახალი თავსებადი მატჩი" },
    detail: {
      en: "Scored a 94% flatmate fit near Vake — schedules and tidiness align.",
      ka: "94% თანხვედრა ვაკეში — გრაფიკი და სისუფთავე ემთხვევა.",
    },
  },
  {
    kind: "split",
    source: "agent",
    title: { en: "Utilities split recalculated", ka: "კომუნალური თავიდან გადანაწილდა" },
    detail: {
      en: "Pro-rated October bills by move-in dates across 3 flatmates.",
      ka: "ოქტომბრის გადასახადები გადანაწილდა შესვლის თარიღებით 3 თანამცხოვრებზე.",
    },
  },
  {
    kind: "contract",
    source: "agent",
    title: { en: "Lease prepared", ka: "ხელშეკრულება მომზადდა" },
    detail: {
      en: "Draft lease generated and secured in SakhliAI Vault, ready to sign.",
      ka: "ხელშეკრულების მონახაზი დაცულია SakhliAI Vault-ში, მზადაა ხელმოსაწერად.",
    },
  },
  {
    kind: "mediation",
    source: "agent",
    title: { en: "House-rule resolved", ka: "სახლის წესი მოგვარდა" },
    detail: {
      en: "Proposed quiet hours 23:00–08:00 with a Saturday exception.",
      ka: "შემოთავაზდა მშვიდი საათები 23:00–08:00, შაბათის გამონაკლისით.",
    },
  },
  {
    kind: "sync",
    source: "n8n",
    title: { en: "Channels synced", ka: "არხები სინქრონიზდა" },
    detail: {
      en: "Airbnb + Booking.com calendars updated via n8n — no double bookings.",
      ka: "Airbnb + Booking.com კალენდრები განახლდა n8n-ით — ორმაგი ჯავშნის გარეშე.",
    },
  },
  {
    kind: "cleaning",
    source: "n8n",
    title: { en: "Cleaning dispatched", ka: "დასუფთავება დაინიშნა" },
    detail: {
      en: "Auto-scheduled a turnover 3h after checkout and texted the cleaner.",
      ka: "ავტომატურად დაიგეგმა დასუფთავება გასვლიდან 3სთ-ში და ეცნობა დამლაგებელს.",
    },
  },
  {
    kind: "lock",
    source: "n8n",
    title: { en: "Smart-lock code rotated", ka: "ჭკვიანი საკეტის კოდი განახლდა" },
    detail: {
      en: "Issued a fresh entry code valid only for the guest's stay window.",
      ka: "გაიცა ახალი კოდი, რომელიც მოქმედებს მხოლოდ სტუმრის ყოფნის პერიოდში.",
    },
  },
  {
    kind: "screen",
    source: "agent",
    title: { en: "Applicant screened", ka: "აპლიკანტი შემოწმდა" },
    detail: {
      en: "Verified student rated 'ideal' — low churn risk, stable income.",
      ka: "ვერიფიცირებული სტუდენტი — 'იდეალური', დაბალი churn რისკი, სტაბილური შემოსავალი.",
    },
  },
];

function templatesFor(persona: Persona): AgentEventTemplate[] {
  if (persona === "marketing") return TEMPLATES;
  const kinds = persona === "student" ? STUDENT_KINDS : HOST_KINDS;
  return TEMPLATES.filter((t) => kinds.includes(t.kind));
}

let counter = 0;
function makeEvent(tpl: AgentEventTemplate, locale: Locale, at = Date.now()): AgentEvent {
  counter += 1;
  return {
    id: `ev_${at}_${counter}`,
    kind: tpl.kind,
    source: tpl.source,
    title: tpl.title[locale],
    detail: tpl.detail[locale],
    at,
  };
}

/** A scripted, ordered sequence — used by the landing automation timeline. */
export function scriptedTimeline(locale: Locale): AgentEvent[] {
  const order: AgentEventKind[] = ["match", "split", "screen", "sync", "cleaning", "lock"];
  const now = Date.now();
  return order
    .map((kind, i) => {
      const tpl = TEMPLATES.find((t) => t.kind === kind);
      return tpl ? makeEvent(tpl, locale, now - (order.length - i) * 4000) : null;
    })
    .filter((e): e is AgentEvent => e !== null);
}

type FeedOptions = {
  persona?: Persona;
  /** how many events to keep in the rolling window */
  max?: number;
  /** ms between simulated events; 0 disables the live stream */
  intervalMs?: number;
  /** number of seed events to start with */
  seed?: number;
};

/**
 * Rolling, live agent feed. Returns the most-recent-first list and a `latest`
 * pointer (handy for firing a toast when a new event lands).
 */
export function useAgentFeed(locale: Locale, opts: FeedOptions = {}) {
  const { persona = "marketing", max = 8, intervalMs = 5000, seed = 3 } = opts;
  const pool = useRef(templatesFor(persona));
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [latest, setLatest] = useState<AgentEvent | null>(null);
  const [usingDatabase, setUsingDatabase] = useState(false);

  // 1) Load initial events from Supabase and subscribe to realtime
  useEffect(() => {
    let active = true;

    const fetchSupabaseEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("agent_events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(max);

        if (error) {
          console.warn("Supabase agent_events table not loaded/accessible, falling back to mock stream.", error);
          return;
        }

        if (active && data && data.length > 0) {
          setUsingDatabase(true);
          const mapped: AgentEvent[] = data.map((d) => ({
            id: d.id,
            kind: d.kind as AgentEventKind,
            source: d.source as AgentEventSource,
            title: locale === "ka" ? d.title_ka : d.title_en,
            detail: locale === "ka" ? d.detail_ka : d.detail_en,
            at: new Date(d.created_at).getTime(),
          }));
          setEvents(mapped);
        }
      } catch (err) {
        console.warn("Failed to query agent_events, running simulation fallback", err);
      }
    };

    fetchSupabaseEvents();

    const channel = supabase
      .channel("agent-events-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_events",
        },
        (payload) => {
          if (!active) return;
          setUsingDatabase(true);
          const d = payload.new;
          const ev: AgentEvent = {
            id: d.id,
            kind: d.kind as AgentEventKind,
            source: d.source as AgentEventSource,
            title: locale === "ka" ? d.title_ka : d.title_en,
            detail: locale === "ka" ? d.detail_ka : d.detail_en,
            at: new Date(d.created_at).getTime(),
          };
          setLatest(ev);
          setEvents((prev) => {
            // Filter out any mock/simulated events once we get real DB events
            const base = prev.filter((item) => !item.id.startsWith("ev_"));
            return [ev, ...base].slice(0, max);
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [locale, max]);

  // 2) Seed once on mount if not using database events yet (mock stream)
  useEffect(() => {
    if (usingDatabase) return;
    const now = Date.now();
    const seeded = Array.from({ length: seed }, (_, i) => {
      const tpl = pool.current[i % pool.current.length];
      return makeEvent(tpl, locale, now - (seed - i) * 6000);
    }).reverse();
    setEvents(seeded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona, locale, usingDatabase]);

  // 3) Periodically generate simulated events ONLY if not receiving database events
  useEffect(() => {
    if (usingDatabase || !intervalMs) return;
    const id = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) return;
      const tpl = pool.current[Math.floor(Math.random() * pool.current.length)];
      const ev = makeEvent(tpl, locale);
      setLatest(ev);
      setEvents((prev) => [ev, ...prev].slice(0, max));
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, max, locale, usingDatabase]);

  return { events, latest };
}
