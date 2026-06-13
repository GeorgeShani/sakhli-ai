import type { SleepSchedule, StudentProfile } from "./student-store";

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

/* Compatibility scoring */
export function scoreFlatmate(profile: StudentProfile, f: Flatmate): number {
  let score = 0;
  let max = 0;

  // Budget overlap (closer = better) — 30 pts
  max += 30;
  const diff = Math.abs(profile.budget - f.budget);
  score += Math.max(0, 30 - diff / 30);

  // Sleep schedule — 20 pts
  max += 20;
  if (profile.sleep === f.sleep) score += 20;
  else if (profile.sleep === "flexible" || f.sleep === "flexible") score += 12;

  // Cleanliness diff (1-5) — 20 pts
  max += 20;
  score += Math.max(0, 20 - Math.abs(profile.cleanliness - f.cleanliness) * 5);

  // Habit alignment — 30 pts (smoking, pets, parties, quiet)
  max += 30;
  const habits: (keyof StudentProfile)[] = ["smoking", "pets", "parties", "quiet"];
  for (const h of habits) {
    if ((profile as any)[h] === (f as any)[h]) score += 7.5;
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
