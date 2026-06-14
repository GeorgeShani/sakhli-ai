import {
  Heart,
  Wallet,
  FileSignature,
  Scale,
  RefreshCcw,
  Sparkles,
  KeyRound,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { AgentEventKind } from "@/lib/agent-events";

/** Shared icon + accent class for each agent-event kind. */
export const EVENT_STYLE: Record<AgentEventKind, { Icon: LucideIcon; tint: string }> = {
  match: { Icon: Heart, tint: "text-rose-500 bg-rose-500/12" },
  split: { Icon: Wallet, tint: "text-emerald-500 bg-emerald-500/12" },
  contract: { Icon: FileSignature, tint: "text-violet-500 bg-violet-500/12" },
  mediation: { Icon: Scale, tint: "text-amber-500 bg-amber-500/12" },
  sync: { Icon: RefreshCcw, tint: "text-sky-500 bg-sky-500/12" },
  cleaning: { Icon: Sparkles, tint: "text-cyan-500 bg-cyan-500/12" },
  lock: { Icon: KeyRound, tint: "text-indigo-500 bg-indigo-500/12" },
  screen: { Icon: UserCheck, tint: "text-teal-500 bg-teal-500/12" },
};
