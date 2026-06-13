import { useEffect, useState } from "react";

export type SleepSchedule = "early_bird" | "night_owl" | "flexible";

export type StudentProfile = {
  name: string;
  university: string;
  budget: number;
  sleep: SleepSchedule;
  smoking: boolean;
  pets: boolean;
  parties: boolean;
  quiet: boolean;
  cleanliness: number;
  bio: string;
};

export type Match = {
  kind: "person" | "place";
  id: string;
  liked: boolean;
};

const PROFILE_KEY = "sakli.profile";
const MATCHES_KEY = "sakli.matches";

export const defaultProfile: StudentProfile = {
  name: "",
  university: "",
  budget: 1200,
  sleep: "flexible",
  smoking: false,
  pets: false,
  parties: false,
  quiet: true,
  cleanliness: 3,
  bio: "",
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

export function useProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProfile(read<StudentProfile | null>(PROFILE_KEY, null));
    setLoaded(true);
  }, []);

  const save = (p: StudentProfile) => {
    setProfile(p);
    if (typeof window !== "undefined") localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  };

  return { profile, loaded, save };
}

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    setMatches(read<Match[]>(MATCHES_KEY, []));
  }, []);

  const record = (kind: Match["kind"], id: string, liked: boolean) => {
    setMatches((prev) => {
      const next = [...prev.filter((m) => !(m.kind === kind && m.id === id)), { kind, id, liked }];
      if (typeof window !== "undefined") localStorage.setItem(MATCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    setMatches([]);
    if (typeof window !== "undefined") localStorage.removeItem(MATCHES_KEY);
  };

  return { matches, record, reset };
}
