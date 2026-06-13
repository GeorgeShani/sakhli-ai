import { useEffect, useState } from "react";

export type Plan = "free" | "plus" | "ultra";

const PLAN_KEY = "sakli.plan";
const SWIPES_KEY = "sakli.freeSwipes";

export const FREE_SWIPE_LIMIT = 5;

export const PLAN_DETAILS: Record<
  Plan,
  { name: string; nameKa: string; price: number; tag: string; tagKa: string }
> = {
  free: {
    name: "Free",
    nameKa: "უფასო",
    price: 0,
    tag: "Up to 5 swipes · basic browsing",
    tagKa: "5 სვაიპამდე · ძირითადი დათვალიერება",
  },
  plus: {
    name: "SakliAI Plus",
    nameKa: "SakliAI Plus",
    price: 19,
    tag: "Unlimited swipes · basic filters · AI Best Fit",
    tagKa: "შეუზღუდავი სვაიპები · ფილტრები · AI Best Fit",
  },
  ultra: {
    name: "SakliAI Ultra",
    nameKa: "SakliAI Ultra",
    price: 49,
    tag: "Priority matches · premium tiers · concierge",
    tagKa: "პრიორიტეტული მატჩები · პრემიუმ წვდომა · კონსიერჟი",
  },
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useSubscription() {
  const [plan, setPlanState] = useState<Plan>("free");
  const [swipes, setSwipesState] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPlanState(read<Plan>(PLAN_KEY, "free"));
    setSwipesState(read<number>(SWIPES_KEY, 0));
    setLoaded(true);
  }, []);

  const setPlan = (p: Plan) => {
    setPlanState(p);
    if (typeof window !== "undefined") localStorage.setItem(PLAN_KEY, JSON.stringify(p));
  };

  const bumpSwipes = () => {
    setSwipesState((n) => {
      const next = n + 1;
      if (typeof window !== "undefined") localStorage.setItem(SWIPES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetSwipes = () => {
    setSwipesState(0);
    if (typeof window !== "undefined") localStorage.setItem(SWIPES_KEY, "0");
  };

  const isPaid = plan === "plus" || plan === "ultra";
  const swipesLeft = isPaid ? Infinity : Math.max(0, FREE_SWIPE_LIMIT - swipes);
  const swipeBlocked = !isPaid && swipes >= FREE_SWIPE_LIMIT;

  return { plan, setPlan, swipes, bumpSwipes, resetSwipes, isPaid, swipesLeft, swipeBlocked, loaded };
}
