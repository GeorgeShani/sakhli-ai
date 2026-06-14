import { Sparkles } from "lucide-react";

/**
 * The single, shared "AI is working" affordance. Reused by the utility
 * splitter, dispute mediator, assistant bubble, and rent predictor so every
 * AI touchpoint reads as the *same* agent.
 *
 * Uses a pure-CSS bounce (cheap, compositor-friendly) rather than a JS
 * animation loop so it doesn't keep the main thread busy.
 */
export function AgentThinking({
  label = "SakhliAI is thinking",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm text-foreground/80 ${className}`}
    >
      <Sparkles className="h-3.5 w-3.5 text-accent" />
      <span>{label}</span>
      <span className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </div>
  );
}
