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
  /** When set, fitScoreForFlatmate returns this exact AI-curated score. */
  aiPremiumScore?: number;
};

export type Property = {
  id: string;
  title: string;
  district: string;
  address?: string;
  description?: string;
  price: number;
  bedrooms: number;
  flatmatesNeeded: number;
  amenities: string[];
  image: string;
  /** When set, fitScoreForProperty returns this exact AI-curated score. */
  aiPremiumScore?: number;
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
    verified: true,
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
    verified: true,
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
    verified: true,
  },
  {
    id: "f4",
    name: "Luka T.",
    age: 22,
    university: "Georgian American University",
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
    verified: false,
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
    verified: true,
  },
  {
    id: "f5",
    name: "Mariam J.",
    age: 24,
    university: "Tbilisi State University",
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
    verified: true,
  },
  {
    id: "f7",
    name: "Tamta L.",
    age: 22,
    university: "Tbilisi State University",
    budget: 1100,
    sleep: "flexible",
    cleanliness: 4,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "AI-curated top pick. Architecture MA student, very tidy, splits utilities fairly.",
    avatar: avatars("tamta-premium"),
    salaryBracket: "2000_plus",
    incomeSource: "job",
    verified: true,
    aiPremiumScore: 88,
  },
  {
    id: "f8",
    name: "Davit Ch.",
    age: 23,
    university: "Free University of Tbilisi",
    budget: 1200,
    sleep: "flexible",
    cleanliness: 4,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "AI Premium match. CS grad, remote SWE, calm flat, great splitter.",
    avatar: avatars("davit-premium"),
    salaryBracket: "2000_plus",
    incomeSource: "job",
    verified: true,
    aiPremiumScore: 91,
  },
  {
    id: "f9",
    name: "Salome G.",
    age: 21,
    university: "Ilia State University",
    budget: 1150,
    sleep: "flexible",
    cleanliness: 5,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "AI top pick. Psychology MA, scholarship + part-time, lifelong tidy roommate energy.",
    avatar: avatars("salome-premium"),
    salaryBracket: "1000_2000",
    incomeSource: "mixed",
    verified: true,
    aiPremiumScore: 94,
  },
  {
    id: "f10",
    name: "Beka N.",
    age: 24,
    university: "Georgian American University",
    budget: 1250,
    sleep: "flexible",
    cleanliness: 5,
    smoking: false,
    pets: false,
    parties: false,
    quiet: true,
    bio: "AI Premium pick. Finance grad, stable income, near-perfect lifestyle alignment.",
    avatar: avatars("beka-premium"),
    salaryBracket: "2000_plus",
    incomeSource: "job",
    verified: true,
    aiPremiumScore: 96,
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
  {
    id: "p6",
    title: "AI Pick · Premium 2BR near TSU",
    district: "Vake, Tbilisi",
    address: "12 Chavchavadze Ave, Vake, Tbilisi 0179",
    description:
      "Renovated 2-bedroom flat steps from TSU. Bright south-facing living room, full kitchen, in-unit laundry. Curated by SakhliAI as a top student-host hybrid listing.",
    price: 1800,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Washer", "Dishwasher", "Heating", "AC", "Balcony"],
    image: propImg("1505691938895-1758d7feb511"),
    aiPremiumScore: 88,
  },
  {
    id: "p7",
    title: "AI Pick · Quiet Saburtalo Studio Hybrid",
    district: "Saburtalo, Tbilisi",
    address: "47 Pekini St, Saburtalo, Tbilisi 0160",
    description:
      "Studio + sleeping nook, perfect for two compatible students. 6-min metro to GAU and Iliauni. Pre-vetted by SakhliAI for safe long-term + tourist hybrid use.",
    price: 1500,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Elevator", "Workspace", "Heating", "AC"],
    image: propImg("1554995207-c18c203602cb"),
    aiPremiumScore: 91,
  },
  {
    id: "p8",
    title: "AI Pick · Sololaki Loft, Verified Hybrid",
    district: "Sololaki, Tbilisi",
    address: "8 Asatiani St, Sololaki, Tbilisi 0105",
    description:
      "Historic loft, fully refurbished. Pet-friendly, secure entrance, smart locks. Top SakhliAI fit score for students seeking premium long-term housing with weekend tourist sublet option.",
    price: 1650,
    bedrooms: 2,
    flatmatesNeeded: 1,
    amenities: ["Wi-Fi", "Pet friendly", "Smart lock", "Heating", "Workspace", "Balcony"],
    image: propImg("1493809842364-78817add7ffb"),
    aiPremiumScore: 94,
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
  if (typeof p.aiPremiumScore === "number") {
    const score = Math.max(0, Math.min(100, Math.round(p.aiPremiumScore)));
    return {
      score,
      tier: score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "risky",
      reasons: ["AI Premium curated listing", "Top SakhliAI hybrid pick"],
      summary: "AI Premium pick — top SakhliAI hybrid listing.",
      financialSafe: true,
    };
  }
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
  if (typeof f.aiPremiumScore === "number") {
    const score = Math.max(0, Math.min(100, Math.round(f.aiPremiumScore)));
    return {
      score,
      tier: score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "risky",
      reasons: ["AI Premium curated match", "Top SakhliAI ranked profile"],
      summary: "AI Premium pick — top SakhliAI ranking.",
      financialSafe: true,
    };
  }
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

/* ---------- SakhliAI Assistant — Georgian bullet explanations ---------- */

const SLEEP_KA: Record<SleepSchedule, string> = {
  early_bird: "დილის ფრინველი",
  night_owl: "ღამის ბუ",
  flexible: "მოქნილი რეჟიმის",
};

const UNI_SHORT_KA: Record<string, string> = {
  TSU: "თსუ-ში",
  "Tbilisi State University": "თსუ-ში",
  "Ilia State University": "ილიაუნი-ში",
  "Free University of Tbilisi": "თავისუფალ უნივერსიტეტში",
  GAU: "GAU-ში",
  "Caucasus University": "კავკასიის უნივერსიტეტში",
};

function uniKa(u: string) {
  return UNI_SHORT_KA[u] ?? `${u}-ში`;
}

export type AssistantBullet = {
  icon: "match" | "money" | "habit" | "schedule" | "warning";
  text: string;
};

/** Bilingual-Georgian bullets shown inside the "SakhliAI ასისტენტი" card. */
export function aiAssistantBullets(profile: StudentProfile, f: Flatmate): AssistantBullet[] {
  const bullets: AssistantBullet[] = [];

  const sameUni =
    !!profile.university &&
    !!f.university &&
    profile.university.trim().toLowerCase() === f.university.trim().toLowerCase();
  const sameSleep = profile.sleep === f.sleep;
  const closeClean = Math.abs(profile.cleanliness - f.cleanliness) <= 1;

  if (sameUni && sameSleep && closeClean) {
    bullets.push({
      icon: "match",
      text: `ორივე სწავლობთ ${uniKa(f.university)}, ხართ ${SLEEP_KA[f.sleep]} და გაქვთ სისუფთავის იდენტური მოთხოვნები.`,
    });
  } else {
    if (sameUni)
      bullets.push({ icon: "match", text: `ორივე სწავლობთ ${uniKa(f.university)} — გზაზე და გრაფიკზე იოლი თანხვედრა.` });
    if (sameSleep)
      bullets.push({ icon: "schedule", text: `ორივე ${SLEEP_KA[f.sleep]} ხართ — ძილის რეჟიმი ემთხვევა.` });
    if (closeClean)
      bullets.push({
        icon: "habit",
        text: `სისუფთავის სტანდარტი თითქმის იდენტურია (${profile.cleanliness}/5 ↔ ${f.cleanliness}/5).`,
      });
  }

  const combined = profile.budget + f.budget;
  const targetRent = 1600;
  if (combined >= targetRent) {
    bullets.push({
      icon: "money",
      text: `თქვენი ბიუჯეტების ჯამი (₾${combined}) სრულად ფარავს ბინის ქირას, რაც ფინანსურად სტაბილურს ხდის თანაცხოვრებას.`,
    });
  } else {
    bullets.push({
      icon: "warning",
      text: `ჯამური ბიუჯეტი (₾${combined}) ოდნავ ჩამორჩება საშუალო ქირას ₾${targetRent} — განიხილეთ ცენტრს გარეთ ვარიანტი.`,
    });
  }

  const habitDiffs: string[] = [];
  if (profile.smoking !== f.smoking) habitDiffs.push("მოწევა");
  if (profile.pets !== f.pets) habitDiffs.push("შინაური ცხოველი");
  if (profile.parties !== f.parties) habitDiffs.push("წვეულებები");
  if (profile.quiet !== f.quiet) habitDiffs.push("მშვიდი საათები");
  if (habitDiffs.length === 0) {
    bullets.push({ icon: "habit", text: "ცხოვრების სტილის ჩვევები სრულად ემთხვევა — სახლის წესები ერთნაირია." });
  } else if (habitDiffs.length <= 2) {
    bullets.push({ icon: "habit", text: `მცირე განსხვავება მხოლოდ: ${habitDiffs.join(", ")}. შეთანხმება ადვილია.` });
  } else {
    bullets.push({ icon: "warning", text: `ჩვევებში განსხვავება: ${habitDiffs.join(", ")} — საჭიროა ღია საუბარი.` });
  }

  return bullets;
}

/* ---------- Host-side AI tenant screening ---------- */

export type TenantScreening = {
  verdict: "ideal" | "good" | "review";
  summary: string;
  churnRisk: "დაბალი" | "საშუალო" | "მაღალი";
  score: number;
};

type ApplicantLike = {
  name: string | null;
  university: string | null;
  salary_bracket: string | null;
  income_source: string | null;
  sleep: string | null;
  smoking: boolean | null;
  cleanliness: number | null;
  budget: number | null;
};

export function screenApplicant(a: ApplicantLike, propertyPrice = 1600): TenantScreening {
  let score = 60;
  const uni = a.university ?? "";
  if (/TSU|Ilia|Free|GAU|Caucasus|university|უნი/i.test(uni)) score += 12;
  if (a.smoking === false) score += 8;
  if ((a.cleanliness ?? 3) >= 4) score += 8;
  if (a.income_source === "job" || a.income_source === "mixed") score += 10;
  if (a.salary_bracket === "1000_2000" || a.salary_bracket === "2000_plus") score += 8;
  const budgetMid = a.budget ?? 0;
  if (budgetMid >= propertyPrice * 0.5) score += 6;
  score = Math.min(100, score);

  const verdict: TenantScreening["verdict"] = score >= 85 ? "ideal" : score >= 70 ? "good" : "review";
  const churnRisk: TenantScreening["churnRisk"] = score >= 85 ? "დაბალი" : score >= 70 ? "საშუალო" : "მაღალი";
  const uniKaName = uniKa(uni || "უნივერსიტეტი");
  const smokeKa = a.smoking ? "ეწევა" : "არ ეწევა";
  const verdictKa =
    verdict === "ideal" ? "იდეალური მდგმური" : verdict === "good" ? "ვარგისი მდგმური" : "საჭიროებს გადახედვას";
  const summary = `AI შეფასება: ${verdictKa}. სწავლობს ${uniKaName}, ${smokeKa}, და ბინის მდებარეობა მისთვის იდეალურია აკადემიური თვალსაზრისით. Churn Risk: ${churnRisk}.`;
  return { verdict, summary, churnRisk, score };
}

