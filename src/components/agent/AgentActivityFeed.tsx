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
        <div className="flex items-center gap-2">
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
          <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
            {relTime(event.at)}
          </span>
        </div>
        {!compact && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{event.detail}</p>
        )}
      </div>
    </div>
  );
}

/** Animated, most-recent-first stream of agent + n8n events. */
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
    <ul className={`space-y-3 ${className}`}>
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl border border-border bg-card/60 p-3"
          >
            <AgentEventRow event={event} compact={compact} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
