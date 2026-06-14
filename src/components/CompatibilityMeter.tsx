import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

export type Factor = { label: string; value: number };

function tierColor(v: number): string {
  if (v >= 85) return "var(--success)";
  if (v >= 70) return "var(--accent)";
  if (v >= 50) return "var(--warning)";
  return "var(--destructive)";
}

/** Animated 0→value count-up that only runs once it scrolls into view. */
function CountUp({ value, className = "" }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}

/** Single labelled compatibility bar with a count-up percentage. */
export function CompatibilityMeter({
  value,
  label,
  sublabel,
  size = "md",
}: {
  value: number;
  label?: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const color = tierColor(value);
  const barH = size === "lg" ? "h-3" : size === "sm" ? "h-1.5" : "h-2";

  return (
    <div ref={ref}>
      {(label || value != null) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          <span className="font-display text-sm font-bold tabular-nums" style={{ color }}>
            <CountUp value={value} />%
          </span>
        </div>
      )}
      <div className={`w-full overflow-hidden rounded-full bg-secondary ${barH}`}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${value}%` } : { width: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </div>
      {sublabel && <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>}
    </div>
  );
}

/** A stack of factor bars — used on cards, dashboard, and the landing explainer. */
export function CompatibilityBreakdown({
  factors,
  className = "",
}: {
  factors: Factor[];
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {factors.map((f, i) => (
        <motion.div
          key={f.label}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
        >
          <CompatibilityMeter value={f.value} label={f.label} size="sm" />
        </motion.div>
      ))}
    </div>
  );
}
