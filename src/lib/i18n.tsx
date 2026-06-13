import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "ka";

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "SakliAI",
  "app.tagline": "Smart rentals for Georgia",
  "nav.home": "Home",
  "nav.matches": "Matches",
  "nav.dashboard": "Dashboard",
  "nav.start": "Get started",

  "hero.title": "Find your flatmate. Find your flat.",
  "hero.subtitle":
    "SakliAI matches students in Georgia with compatible flatmates and long-term homes — using behavior, budget, and lifestyle, not just photos.",
  "hero.cta.primary": "Start matching",
  "hero.cta.secondary": "How it works",
  "hero.stat.students": "Students onboarded",
  "hero.stat.matches": "Successful matches",
  "hero.stat.cities": "Cities covered",

  "features.title": "Built for student life in Georgia",
  "features.match.title": "Behavioral matching",
  "features.match.desc": "We pair flatmates by sleep schedule, cleanliness, study habits, and budget — not vibes.",
  "features.swipe.title": "Swipe to discover",
  "features.swipe.desc": "Browse compatible flatmates and homes like a feed. Match, chat, move in.",
  "features.split.title": "Split utilities easily",
  "features.split.desc": "Built-in calculator splits rent, internet, and bills fairly across the household.",

  "how.title": "Three steps to your new home",
  "how.s1.title": "Tell us about you",
  "how.s1.desc": "University, budget, habits, and lifestyle in a 2-minute quiz.",
  "how.s2.title": "Swipe your matches",
  "how.s2.desc": "Review compatible flatmates and properties scored just for you.",
  "how.s3.title": "Move in",
  "how.s3.desc": "Chat in-app, split utilities, sign your lease — all in one place.",

  "footer.rights": "All rights reserved.",

  "onboarding.title": "Let's build your profile",
  "onboarding.subtitle": "2 minutes. No spam. Better matches.",
  "onboarding.step": "Step",
  "onboarding.of": "of",
  "onboarding.next": "Continue",
  "onboarding.back": "Back",
  "onboarding.finish": "See my matches",

  "onboarding.q1.title": "Where do you study?",
  "onboarding.q1.placeholder": "e.g. Tbilisi State University",
  "onboarding.q1.label": "University",
  "onboarding.q1.name": "Your name",

  "onboarding.q2.title": "What's your monthly budget?",
  "onboarding.q2.desc": "All-in, including utilities (GEL / month)",

  "onboarding.q3.title": "When are you most awake?",
  "onboarding.q3.early": "Early bird",
  "onboarding.q3.night": "Night owl",
  "onboarding.q3.flex": "Flexible",

  "onboarding.q4.title": "Your habits",
  "onboarding.q4.smoking": "I'm okay with smoking indoors",
  "onboarding.q4.pets": "I'm okay with pets",
  "onboarding.q4.parties": "I enjoy hosting parties",
  "onboarding.q4.quiet": "I need quiet study hours",

  "onboarding.q5.title": "How tidy are you?",
  "onboarding.q5.scale": "1 = relaxed, 5 = spotless",

  "onboarding.q6.title": "Tell flatmates about you",
  "onboarding.q6.placeholder": "A few words about your studies, hobbies, what you're looking for…",

  "matches.title": "Your matches",
  "matches.subtitle": "Swipe right to connect, left to pass.",
  "matches.tab.people": "Flatmates",
  "matches.tab.places": "Properties",
  "matches.compat": "Compatibility",
  "matches.budget": "Budget",
  "matches.empty.title": "You've seen everyone for now",
  "matches.empty.desc": "Check back soon — new students join every day.",
  "matches.empty.reset": "Reset stack",
  "matches.pass": "Pass",
  "matches.like": "Connect",

  "dashboard.title": "Your dashboard",
  "dashboard.subtitle": "Manage matches, bills, and chats in one place.",
  "dashboard.tab.matches": "Matches",
  "dashboard.tab.utilities": "Utilities",
  "dashboard.tab.chat": "Chat",
  "dashboard.matches.empty": "No matches yet. Start swiping!",
  "dashboard.matches.go": "Go to matches",

  "utilities.title": "Split utilities",
  "utilities.desc": "Add bills, add people, we do the math.",
  "utilities.bill": "Bill name",
  "utilities.amount": "Amount (GEL)",
  "utilities.add": "Add bill",
  "utilities.people": "People in flat",
  "utilities.perPerson": "Per person",
  "utilities.total": "Total",
  "utilities.remove": "Remove",

  "chat.title": "Chat with your matches",
  "chat.placeholder": "Type a message…",
  "chat.send": "Send",
  "chat.empty": "Select a match to start chatting",
};

const ka: Dict = {
  "app.name": "SakliAI",
  "app.tagline": "ჭკვიანი ქირაობა საქართველოში",
  "nav.home": "მთავარი",
  "nav.matches": "შესაბამისობები",
  "nav.dashboard": "დაფა",
  "nav.start": "დაიწყე",

  "hero.title": "იპოვე თანამცხოვრები. იპოვე ბინა.",
  "hero.subtitle":
    "SakliAI აკავშირებს სტუდენტებს საქართველოში თავსებად თანამცხოვრებთან და გრძელვადიან ბინებთან — ქცევის, ბიუჯეტისა და ცხოვრების სტილის მიხედვით.",
  "hero.cta.primary": "დაიწყე შერჩევა",
  "hero.cta.secondary": "როგორ მუშაობს",
  "hero.stat.students": "რეგისტრირებული სტუდენტი",
  "hero.stat.matches": "წარმატებული შერჩევა",
  "hero.stat.cities": "ქალაქი",

  "features.title": "შექმნილია ქართველი სტუდენტებისთვის",
  "features.match.title": "ქცევაზე დაფუძნებული შერჩევა",
  "features.match.desc": "ვამოწმებთ ძილის რეჟიმს, სისუფთავეს, სწავლის ჩვევებსა და ბიუჯეტს.",
  "features.swipe.title": "აღმოაჩინე გადაცურვით",
  "features.swipe.desc": "ნახე თავსებადი თანამცხოვრებლები და ბინები ფიდის სტილში.",
  "features.split.title": "გაიყავი კომუნალური მარტივად",
  "features.split.desc": "ჩაშენებული კალკულატორი სამართლიანად ანაწილებს გადასახადებს.",

  "how.title": "სამი ნაბიჯი ახალ სახლამდე",
  "how.s1.title": "გვითხარი შენ შესახებ",
  "how.s1.desc": "უნივერსიტეტი, ბიუჯეტი, ჩვევები — 2 წუთიანი ქვიზი.",
  "how.s2.title": "გადაცურე შენი შესაბამისობები",
  "how.s2.desc": "ნახე თავსებადი ადამიანები და ბინები.",
  "how.s3.title": "გადადი საცხოვრებლად",
  "how.s3.desc": "ჩათი, კომუნალური, ხელშეკრულება — ერთ აპში.",

  "footer.rights": "ყველა უფლება დაცულია.",

  "onboarding.title": "შევქმნათ შენი პროფილი",
  "onboarding.subtitle": "2 წუთი. სპამის გარეშე. უკეთესი შესაბამისობები.",
  "onboarding.step": "ნაბიჯი",
  "onboarding.of": "/",
  "onboarding.next": "გაგრძელება",
  "onboarding.back": "უკან",
  "onboarding.finish": "ჩემი შესაბამისობები",

  "onboarding.q1.title": "სად სწავლობ?",
  "onboarding.q1.placeholder": "მაგ. თბილისის სახელმწიფო უნივერსიტეტი",
  "onboarding.q1.label": "უნივერსიტეტი",
  "onboarding.q1.name": "შენი სახელი",

  "onboarding.q2.title": "შენი თვიური ბიუჯეტი?",
  "onboarding.q2.desc": "ყველაფერი ჩათვლით (ლარი / თვე)",

  "onboarding.q3.title": "როდის ხარ ყველაზე აქტიური?",
  "onboarding.q3.early": "დილის ფრინველი",
  "onboarding.q3.night": "ღამის ბუ",
  "onboarding.q3.flex": "მოქნილი",

  "onboarding.q4.title": "შენი ჩვევები",
  "onboarding.q4.smoking": "ნებას ვრთავ მოწევას ბინაში",
  "onboarding.q4.pets": "შინაური ცხოველები მისაღებია",
  "onboarding.q4.parties": "მიყვარს წვეულებები",
  "onboarding.q4.quiet": "მჭირდება მშვიდი სასწავლო საათები",

  "onboarding.q5.title": "რამდენად სუფთა ხარ?",
  "onboarding.q5.scale": "1 = მოდუნებული, 5 = სრულყოფილი",

  "onboarding.q6.title": "მოგვიყევი შენ შესახებ",
  "onboarding.q6.placeholder": "რამდენიმე სიტყვა შენი სწავლის, ჰობის და ძიების შესახებ…",

  "matches.title": "შენი შესაბამისობები",
  "matches.subtitle": "მარჯვნივ – დაკავშირება, მარცხნივ – გამოტოვება.",
  "matches.tab.people": "თანამცხოვრები",
  "matches.tab.places": "ბინები",
  "matches.compat": "თავსებადობა",
  "matches.budget": "ბიუჯეტი",
  "matches.empty.title": "ჯერჯერობით ყველა ნახე",
  "matches.empty.desc": "შემოიხედე მალე — ახალი სტუდენტები ემატება ყოველდღე.",
  "matches.empty.reset": "თავიდან",
  "matches.pass": "გამოტოვება",
  "matches.like": "დაკავშირება",

  "dashboard.title": "შენი დაფა",
  "dashboard.subtitle": "მართე შესაბამისობები, ანგარიშები და ჩატი.",
  "dashboard.tab.matches": "შესაბამისობები",
  "dashboard.tab.utilities": "კომუნალური",
  "dashboard.tab.chat": "ჩატი",
  "dashboard.matches.empty": "შესაბამისობები არ გაქვს. დაიწყე გადაცურვა!",
  "dashboard.matches.go": "შესაბამისობებზე გადასვლა",

  "utilities.title": "გაიყავი კომუნალური",
  "utilities.desc": "დაამატე ანგარიშები და ხალხი — ჩვენ დავთვლით.",
  "utilities.bill": "ანგარიშის სახელი",
  "utilities.amount": "თანხა (₾)",
  "utilities.add": "დამატება",
  "utilities.people": "ხალხი ბინაში",
  "utilities.perPerson": "თითო კაცზე",
  "utilities.total": "ჯამი",
  "utilities.remove": "წაშლა",

  "chat.title": "ჩათი შენი მატჩებთან",
  "chat.placeholder": "დაწერე შეტყობინება…",
  "chat.send": "გაგზავნა",
  "chat.empty": "აირჩიე მატჩი ჩათის დასაწყებად",
};

const dicts: Record<Locale, Dict> = { en, ka };

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("sakli.locale") as Locale | null) : null;
    if (saved === "en" || saved === "ka") setLocaleState(saved);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("sakli.locale", l);
  };

  const t = (key: string) => dicts[locale][key] ?? dicts.en[key] ?? key;

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
