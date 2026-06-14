import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export type CelebrationTarget = { name: string; avatar: string; score: number } | null;

const CONFETTI = Array.from({ length: 18 });

/** The "It's a match!" moment shown when a like is mutual. */
export function MatchCelebration({
  target,
  onClose,
}: {
  target: CelebrationTarget;
  onClose: () => void;
}) {
  const { t } = useI18n();
  return (
    <AnimatePresence>
      {target && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-primary/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Confetti */}
          {CONFETTI.map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-2 rounded-sm"
              style={{
                left: `${(i / CONFETTI.length) * 100}%`,
                backgroundColor: i % 2 ? "var(--accent)" : "var(--success)",
              }}
              initial={{ y: -40, opacity: 0, rotate: 0 }}
              animate={{ y: "100vh", opacity: [0, 1, 1, 0], rotate: 360 }}
              transition={{ duration: 1.8 + (i % 5) * 0.2, delay: (i % 6) * 0.08, ease: "easeIn" }}
            />
          ))}

          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-2xl"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart className="h-8 w-8 fill-success" />
            </motion.div>

            <h2 className="mt-5 font-display text-2xl font-extrabold">{t("match.celebrate.title")}</h2>

            {target && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <img
                  src={target.avatar}
                  alt={target.name}
                  className="h-16 w-16 rounded-full border-2 border-success object-contain bg-secondary p-1"
                />
                <div className="text-left">
                  <div className="font-display font-bold">{target.name}</div>
                  <div className="text-sm font-semibold text-success">{target.score}% fit</div>
                </div>
              </div>
            )}

            <p className="mt-4 text-sm text-muted-foreground">{t("match.celebrate.desc")}</p>

            <div className="mt-6 flex flex-col gap-2">
              <Button asChild>
                <Link to="/dashboard">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t("match.celebrate.cta")}
                </Link>
              </Button>
              <Button variant="ghost" onClick={onClose}>
                {t("match.celebrate.keep")}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
