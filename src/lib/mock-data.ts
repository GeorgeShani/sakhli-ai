import {
  type IncomeSource,
  type SalaryBracket,
  type SleepSchedule,
  type StudentProfile,
  SALARY_RANGES,
  INCOME_SOURCE_LABEL,
} from "./student-store";

export type Flatmate = {
  id: string;
  name: string;
  age: number;
  university: string;
  budget: number;
  sleep: SleepSchedule;
  cleanliness: number;
  smoking: boolean;
  pets: boolean;
  parties: boolean;
  quiet: boolean;
  bio: string;
  avatar: string;
  salaryBracket: SalaryBracket;
  incomeSource: IncomeSource;
  verified: boolean;
};

export type Property = {
  id: string;
  title: string;
  district: string;
  price: number;
  bedrooms: number;
  flatmatesNeeded: number;
  amenities: string[];
  image: string;
};

const avatars = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export const flatmates: Flatmate[] = [
  {
    id: "f1",
    name: "Nino K.",
    age: 21,
    university: "Tbilisi State University",
    budget: 700,
    sleep: "night_owl",
    cleanliness: 4,
    smoking: false,
    pets: true,
    parties: false,
    quiet: true,
    bio: "Literature major, tea addict, very tidy. Looking for a calm flat in Vake.",
    avatar: avatars("nino"),
    salaryBracket: "500_1000",
    incomeSource: "family",
  },
  {
    id: "f2",
    name: "Giorgi M.",
    age: 23,
    university: "Free University of Tbilisi",
    budget: 900,
    sleep: "early_bird",
    cleanliness: 3,
    smoking: false,
    pets: false,
    parties: true,
    quiet: false,
    bio: "CS student & part-time barista. Cook a lot, host friends on weekends.",
    avatar: avatars("giorgi"),
    salaryBracket: "1000_2000",
    incomeSource: "job",
  },
  {
    id: "f3",
    name: "Ana B.",
    age: 20,
    university: "Ilia State University",
    budget: 600,
    sleep: "flexible",
    cleanliness: 5,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "Med student. Quiet, organized, allergic to cats. Saulo / Saburtalo preferred.",
    avatar: avatars("ana"),
    salaryBracket: "500_1000",
    incomeSource: "scholarship",
  },
  {
    id: "f4",
    name: "Luka T.",
    age: 22,
    university: "GAU",
    budget: 850,
    sleep: "night_owl",
    cleanliness: 2,
    smoking: true,
    pets: true,
    parties: true,
    quiet: false,
    bio: "Designer, musician. Looking for chill flatmates who don't mind late nights.",
    avatar: avatars("luka"),
    salaryBracket: "1000_2000",
    incomeSource: "mixed",
  },
  {
    id: "f5",
    name: "Mariam J.",
    age: 24,
    university: "TSU",
    budget: 1100,
    sleep: "early_bird",
    cleanliness: 4,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "Law grad student. Yoga, runs, very independent. Long-term tenant.",
    avatar: avatars("mariam"),
    salaryBracket: "2000_plus",
    incomeSource: "job",
  },
  {
    id: "f6",
    name: "Saba R.",
    age: 19,
    university: "Caucasus University",
    budget: 550,
    sleep: "flexible",
    cleanliness: 3,
    smoking: false,
    pets: true,
    parties: false,
    quiet: false,
    bio: "First year business student. Friendly, loves cooking Sunday lunches.",
    avatar: avatars("saba"),
    salaryBracket: "under_500",
    incomeSource: "family",
  },
];

const propImg = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=1200&q=70`;

export const properties: Property[] = [
  {
    id: "p1",
    title: "Sunny 3BR near Vake Park",
    district: "Vake, Tbilisi",
    price: 2100,
    bedrooms: 3,
    flatmatesNeeded: 2,
    amenities: ["Wi-Fi", "Washer", "Balcony", "Heating"],
    image: propImg("1554995207-c18c203602cb"),
  },
  {
    id: "p2",
    title: "Modern loft in Saburtalo",
    district: "Saburtalo, Tbilisi",
    price: 1700,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Elevator", "Gym", "Parking"],
    image: propImg("1502672260266-1c1ef2d93688"),
  },
  {
    id: "p3",
    title: "Cozy renovated apartment, Old Tbilisi",
    district: "Sololaki, Tbilisi",
    price: 1400,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Balcony", "Pet friendly"],
    image: propImg("1493809842364-78817add7ffb"),
  },
  {
    id: "p4",
    title: "Budget-friendly student flat",
    district: "Didi Dighomi, Tbilisi",
    price: 1100,
    bedrooms: 3,
    flatmatesNeeded: 2,
    amenities: ["Wi-Fi", "Washer", "Bus stop nearby"],
    image: propImg("1505873242700-f289a29e1e0f"),
  },
  {
    id: "p5",
    title: "Bright 2BR near Batumi Boulevard",
    district: "Batumi center",
    price: 1300,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Sea view", "AC"],
    image: propImg("1493809842364-78817add7ffb"),
  },
];

/* ---------- Legacy raw scores (kept for back-compat) ---------- */

export function scoreFlatmate(profile: StudentProfile, f: Flatmate): number {
  let score = 0;
  let max = 0;

  max += 30;
  const diff = Math.abs(profile.budget - f.budget);
  score += Math.max(0, 30 - diff / 30);

  max += 20;
  if (profile.sleep === f.sleep) score += 20;
  else if (profile.sleep === "flexible" || f.sleep === "flexible") score += 12;

  max += 20;
  score += Math.max(0, 20 - Math.abs(profile.cleanliness - f.cleanliness) * 5);

  max += 30;
  const habits: (keyof StudentProfile)[] = ["smoking", "pets", "parties", "quiet"];
  for (const h of habits) {
    if ((profile as Record<string, unknown>)[h] === (f as unknown as Record<string, unknown>)[h]) {
      score += 7.5;
    }
  }

  return Math.round((score / max) * 100);
}

export function scoreProperty(profile: StudentProfile, p: Property, sharers = 2): number {
  const perPerson = p.price / Math.max(1, sharers);
  const diff = Math.max(0, perPerson - profile.budget);
  const budgetScore = Math.max(0, 70 - diff / 10);
  const sizeBonus = p.flatmatesNeeded > 0 ? 20 : 10;
  const amenityBonus = Math.min(10, p.amenities.length * 2);
  return Math.min(100, Math.round(budgetScore + sizeBonus + amenityBonus));
}

/* ---------- SakhliAI Fit Score (advanced AI logic) ---------- */

export type FitScore = {
  score: number; // 0-100
  tier: "excellent" | "good" | "fair" | "risky";
  reasons: string[]; // short bullets
  summary: string; // one-line AI-style snippet
  financialSafe: boolean;
};

function bracketMid(b: SalaryBracket): number {
  const r = SALARY_RANGES[b];
  return (r.min + r.max) / 2;
}

/** Affordability rule: rent share should be ≤ 40% of estimated income (safe), 40-60% stretch, >60% risky. */
function affordability(estimatedIncome: number, monthlyRentShare: number) {
  if (estimatedIncome <= 0) return { pct: 1, points: 0, status: "risky" as const };
  const pct = monthlyRentShare / estimatedIncome;
  if (pct <= 0.4) return { pct, points: 40, status: "safe" as const };
  if (pct <= 0.6) return { pct, points: 25, status: "stretch" as const };
  if (pct <= 0.8) return { pct, points: 12, status: "tight" as const };
  return { pct, points: 0, status: "risky" as const };
}

export function fitScoreForProperty(
  profile: StudentProfile,
  p: Property,
  sharers = Math.max(1, p.flatmatesNeeded + 1),
): FitScore {
  const reasons: string[] = [];
  const perPerson = p.price / sharers;
  const income = bracketMid(profile.salaryBracket);
  const aff = affordability(income, perPerson);

  let score = aff.points; // up to 40

  if (aff.status === "safe") reasons.push(`Safe financial range (₾${Math.round(perPerson)} / ₾${income} est.)`);
  else if (aff.status === "stretch") reasons.push(`Stretch budget — ${Math.round(aff.pct * 100)}% of income`);
  else if (aff.status === "tight") reasons.push(`Tight budget — ${Math.round(aff.pct * 100)}% of income`);
  else reasons.push(`Rent share above sustainable income range`);

  // Budget intent match (25 pts)
  const intentDiff = Math.abs(profile.budget - perPerson);
  const intentPts = Math.max(0, 25 - intentDiff / 20);
  score += intentPts;
  if (intentPts > 18) reasons.push("Matches your stated budget intent");

  // Income stability (15 pts) — job / mixed > scholarship > family
  const stabilityMap: Record<IncomeSource, number> = { job: 15, mixed: 13, scholarship: 11, family: 9 };
  score += stabilityMap[profile.incomeSource];
  reasons.push(`${INCOME_SOURCE_LABEL[profile.incomeSource]}-based income`);

  // Property quality (20 pts)
  const amenityPts = Math.min(12, p.amenities.length * 2);
  const sharePts = sharers > 1 ? 8 : 4;
  score += amenityPts + sharePts;
  if (amenityPts >= 10) reasons.push(`${p.amenities.length} amenities included`);

  score = Math.min(100, Math.round(score));
  const tier: FitScore["tier"] = score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "risky";
  const summary = buildSummary(tier, reasons.slice(0, 2));

  return { score, tier, reasons, summary, financialSafe: aff.status === "safe" };
}

export function fitScoreForFlatmate(profile: StudentProfile, f: Flatmate): FitScore {
  const reasons: string[] = [];
  let score = 0;

  // Combined affordability — estimate household income vs each person's expected rent share
  const myIncome = bracketMid(profile.salaryBracket);
  const theirIncome = bracketMid(f.salaryBracket);
  const targetRent = (profile.budget + f.budget) / 2;
  const myAff = affordability(myIncome, targetRent);
  const theirAff = affordability(theirIncome, targetRent);
  const combined = (myAff.points + theirAff.points) / 2;
  score += combined; // up to 40
  if (myAff.status === "safe" && theirAff.status === "safe") {
    reasons.push("Both in safe financial range");
  } else if (myAff.status === "risky" || theirAff.status === "risky") {
    reasons.push("Mismatched financial capacity — risky split");
  } else {
    reasons.push("Workable financial overlap");
  }

  // Schedule alignment (20)
  if (profile.sleep === f.sleep) {
    score += 20;
    reasons.push("Matching study/sleep schedules");
  } else if (profile.sleep === "flexible" || f.sleep === "flexible") {
    score += 12;
  } else {
    reasons.push("Different daily rhythms");
  }

  // Cleanliness (15)
  const cleanDiff = Math.abs(profile.cleanliness - f.cleanliness);
  const cleanPts = Math.max(0, 15 - cleanDiff * 4);
  score += cleanPts;
  if (cleanPts >= 12) reasons.push("Similar tidiness standards");

  // Habits (25)
  const habitKeys: Array<keyof Pick<StudentProfile, "smoking" | "pets" | "parties" | "quiet">> = [
    "smoking",
    "pets",
    "parties",
    "quiet",
  ];
  let habitMatch = 0;
  for (const h of habitKeys) if (profile[h] === f[h]) habitMatch += 1;
  score += (habitMatch / habitKeys.length) * 25;
  if (habitMatch >= 3) reasons.push("Lifestyle habits align");

  score = Math.min(100, Math.round(score));
  const tier: FitScore["tier"] = score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "risky";
  const summary = buildSummary(tier, reasons.slice(0, 2));

  return { score, tier, reasons, summary, financialSafe: myAff.status === "safe" && theirAff.status === "safe" };
}

function buildSummary(tier: FitScore["tier"], top: string[]): string {
  const prefix =
    tier === "excellent"
      ? "Excellent SakhliAI fit"
      : tier === "good"
        ? "Strong fit"
        : tier === "fair"
          ? "Workable fit"
          : "Risky fit";
  return top.length ? `${prefix}: ${top.join(" + ").toLowerCase()}.` : `${prefix}.`;
}
