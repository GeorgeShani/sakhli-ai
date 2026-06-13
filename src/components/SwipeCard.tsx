import { useState, type ReactNode } from "react";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

type Props = {
  children: ReactNode;
  onSwipe: (liked: boolean) => void;
};

export function SwipeCard({ children, onSwipe }: Props) {
  const { t } = useI18n();
  const [dragX, setDragX] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setStartX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startX === null) return;
    setDragX(e.clientX - startX);
  };
  const onPointerUp = () => {
    if (Math.abs(dragX) > 120) {
      const liked = dragX > 0;
      setLeaving(liked ? "right" : "left");
      setTimeout(() => {
        onSwipe(liked);
        setDragX(0);
        setLeaving(null);
      }, 220);
    } else {
      setDragX(0);
    }
    setStartX(null);
  };

  const rotate = dragX / 18;
  const opacity = 1 - Math.min(0.3, Math.abs(dragX) / 800);

  const translateX = leaving === "right" ? 600 : leaving === "left" ? -600 : dragX;

  return (
    <div className="relative">
      <div
        className="card-elevated relative touch-none select-none overflow-hidden"
        style={{
          transform: `translateX(${translateX}px) rotate(${leaving ? (leaving === "right" ? 20 : -20) : rotate}deg)`,
          opacity: leaving ? 0 : opacity,
          transition: startX === null || leaving ? "transform 220ms ease, opacity 220ms ease" : undefined,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Like / nope overlay tags */}
        <div
          className="pointer-events-none absolute left-4 top-4 z-10 rounded-md border-2 border-success px-3 py-1 text-sm font-bold uppercase text-success"
          style={{ opacity: Math.max(0, dragX / 100) }}
        >
          {t("matches.like")}
        </div>
        <div
          className="pointer-events-none absolute right-4 top-4 z-10 rounded-md border-2 border-destructive px-3 py-1 text-sm font-bold uppercase text-destructive"
          style={{ opacity: Math.max(0, -dragX / 100) }}
        >
          {t("matches.pass")}
        </div>
        {children}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          size="lg"
          variant="outline"
          className="h-14 w-14 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={() => {
            setLeaving("left");
            setTimeout(() => {
              onSwipe(false);
              setLeaving(null);
            }, 220);
          }}
          aria-label={t("matches.pass")}
        >
          <X className="h-6 w-6" />
        </Button>
        <Button
          size="lg"
          className="h-14 w-14 rounded-full bg-success text-success-foreground hover:bg-success/90"
          onClick={() => {
            setLeaving("right");
            setTimeout(() => {
              onSwipe(true);
              setLeaving(null);
            }, 220);
          }}
          aria-label={t("matches.like")}
        >
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
