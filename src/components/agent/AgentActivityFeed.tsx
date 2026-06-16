import { AnimatePresence, motion } from "framer-motion";
import type { AgentEvent } from "@/lib/agent-events";
import { EVENT_STYLE } from "./event-style";

function relTime(at: number): string {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.round(s / 60);
  return `${m}m`;
}

export function AgentEventRow({
  event,
  compact = false,
}: {
  event: AgentEvent;
  compact?: boolean;
}) {
  const { Icon, tint } = EVENT_STYLE[event.kind];
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tint}`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <p className="truncate text-sm font-semibold">{event.title}</p>
            <span
              className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                event.source === "n8n"
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/15 text-accent-foreground"
              }`}
            >
              {event.source}
            </span>
          </div>
          <span className="shrink-0 text-[11px] text-muted-foreground">{relTime(event.at)}</span>
        </div>
        {!compact && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{event.detail}</p>
        )}
      </div>
    </div>
  );
}

/** Animated, most-recent-first stream of agent + n8n events with silky-smooth springs and layout transitions. */
export function AgentActivityFeed({
  events,
  compact = false,
  className = "",
}: {
  events: AgentEvent[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <ul className={`space-y-3 overflow-hidden p-0.5 ${className}`}>
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.li
            key={event.id}
            layout
            initial={{ opacity: 0, x: -30, scale: 0.95, height: 0 }}
            animate={{ opacity: 1, x: 0, scale: 1, height: "auto" }}
            exit={{ opacity: 0, x: 30, scale: 0.95, height: 0 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
              mass: 0.9,
              opacity: { duration: 0.25 },
            }}
            className="rounded-xl border border-border bg-card/60 p-3 shadow-sm origin-top overflow-hidden"
          >
            <AgentEventRow event={event} compact={compact} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
