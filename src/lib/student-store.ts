import { useEffect, useState } from "react";

export type SleepSchedule = "early_bird" | "night_owl" | "flexible";
export type SalaryBracket = "under_500" | "500_1000" | "1000_2000" | "2000_plus";
export type IncomeSource = "job" | "family" | "scholarship" | "mixed";

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
  verified: boolean;
  salaryBracket: SalaryBracket;
  incomeSource: IncomeSource;
  incomeSources?: IncomeSource[];
  avatar?: string;
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
  verified: false,
  salaryBracket: "500_1000",
  incomeSource: "family",
  incomeSources: ["family"],
};

/* Salary bracket → estimated monthly income range (GEL), bilingual labels */
export const SALARY_RANGES: Record<SalaryBracket, { min: number; max: number; label: string; labelKa: string }> = {
  under_500: { min: 0, max: 500, label: "< 500 GEL", labelKa: "< 500 ლარი" },
  "500_1000": { min: 500, max: 1000, label: "500 – 1,000 GEL", labelKa: "500 – 1,000 ლარი" },
  "1000_2000": { min: 1000, max: 2000, label: "1,000 – 2,000 GEL", labelKa: "1,000 – 2,000 ლარი" },
  "2000_plus": { min: 2000, max: 4000, label: "2,000+ GEL", labelKa: "2,000+ ლარი" },
};

export const INCOME_SOURCE_LABEL: Record<IncomeSource, string> = {
  job: "Job",
  family: "Family",
  scholarship: "Scholarship",
  mixed: "Mixed",
};

export const INCOME_SOURCE_LABEL_KA: Record<IncomeSource, string> = {
  job: "სამსახური",
  family: "ოჯახი",
  scholarship: "სტიპენდია",
  mixed: "შერეული",
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
    const stored = read<Partial<StudentProfile> | null>(PROFILE_KEY, null);
    setProfile(stored ? ({ ...defaultProfile, ...stored } as StudentProfile) : null);
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

  const remove = (kind: Match["kind"], id: string) => {
    setMatches((prev) => {
      const next = prev.filter((m) => !(m.kind === kind && m.id === id));
      if (typeof window !== "undefined") localStorage.setItem(MATCHES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const reset = () => {
    setMatches([]);
    if (typeof window !== "undefined") localStorage.removeItem(MATCHES_KEY);
  };

  return { matches, record, remove, reset };
}
