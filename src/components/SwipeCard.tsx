import { type ReactNode } from "react";
import { motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Props = {
  children: ReactNode;
  onSwipe: (liked: boolean) => void;
};

const SWIPE_THRESHOLD = 110;
const VELOCITY_THRESHOLD = 500;

export function SwipeCard({ children, onSwipe }: Props) {
  const { t } = useI18n();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);
  const glow = useTransform(
    x,
    [-160, 0, 160],
    [
      "0 0 0 2px var(--destructive) inset",
      "0 0 0 0px transparent inset",
      "0 0 0 2px var(--success) inset",
    ],
  );

  const fling = (liked: boolean) => {
    animate(x, liked ? 600 : -600, {
      type: "spring",
      stiffness: 220,
      damping: 28,
      onComplete: () => {
        onSwipe(liked);
        x.set(0);
      },
    });
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD) fling(true);
    else if (offset < -SWIPE_THRESHOLD || velocity < -VELOCITY_THRESHOLD) fling(false);
    else animate(x, 0, { type: "spring", stiffness: 300, damping: 26 });
  };

  return (
    <div className="relative">
      <motion.div
        className="card-elevated relative touch-none select-none overflow-hidden"
        style={{ x, rotate, boxShadow: glow }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        <motion.div
          className="pointer-events-none absolute left-4 top-4 z-10 rounded-md border-2 border-success px-3 py-1 text-sm font-bold uppercase text-success"
          style={{ opacity: likeOpacity }}
        >
          {t("matches.like")}
        </motion.div>
        <motion.div
          className="pointer-events-none absolute right-4 top-4 z-10 rounded-md border-2 border-destructive px-3 py-1 text-sm font-bold uppercase text-destructive"
          style={{ opacity: nopeOpacity }}
        >
          {t("matches.pass")}
        </motion.div>
        {children}
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => fling(false)}
          aria-label={t("matches.pass")}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-success text-success-foreground hover:bg-success/90"
          onClick={() => fling(true)}
          aria-label={t("matches.like")}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
