import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "ka";

type Dict = Record<string, string>;

const en: Dict = {
  "app.name": "SakhliAI",
  "app.tagline": "Smart rentals for Georgia",
  "nav.home": "Home",
  "nav.matches": "Matches",
  "nav.dashboard": "Dashboard",
  "nav.start": "Get started",
  "nav.discover": "Discover",
  "nav.saved": "Matches",
  "nav.utilities": "Bills",
  "nav.profile": "Profile",
  "match.celebrate.title": "It's a match!",
  "match.celebrate.desc": "You both liked each other. Say hi and start planning.",
  "match.celebrate.cta": "Send a message",
  "match.celebrate.keep": "Keep swiping",
  "matches.undo": "Undo",
  "host.nav.overview": "Overview",
  "host.nav.calendar": "Calendar",
  "host.nav.channels": "Channels",
  "host.nav.applicants": "Applicants",
  "host.nav.operations": "Operations",
  "host.n8n.connected": "Connected to n8n",
  "host.n8n.lastsync": "last sync",

  "hero.title": "Find your flatmate. Find your flat.",
  "hero.subtitle":
    "SakhliAI matches students in Georgia with compatible flatmates and long-term homes — using behavior, budget, and lifestyle, not just photos.",
  "hero.cta.primary": "Start matching",
  "hero.cta.secondary": "How it works",
  "hero.stat.students": "Students onboarded",
  "hero.stat.matches": "Successful matches",
  "hero.stat.cities": "Cities covered",

  "features.title": "Built for student life in Georgia",
  "features.match.title": "Behavioral matching",
  "features.match.desc": "We pair flatmates by sleep schedule, cleanliness, study habits, and budget — not vibes.",
  "features.swipe.title": "Swipe to discover",
  "features.swipe.desc": "Browse compatible flatmates and homes like a feed. Match and move in.",
  "features.split.title": "Split utilities easily",
  "features.split.desc": "Built-in calculator splits rent, internet, and bills fairly across the household.",

  "how.title": "Three steps to your new home",
  "how.s1.title": "Tell us about you",
  "how.s1.desc": "University, budget, habits, and lifestyle in a 2-minute quiz.",
  "how.s2.title": "Swipe your matches",
  "how.s2.desc": "Review compatible flatmates and properties scored just for you.",
  "how.s3.title": "Move in",
  "how.s3.desc": "Split utilities, sign your lease — all in one place.",

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

  "onboarding.reveal.tag": "Your housing personality",
  "onboarding.reveal.ready": "Profile ready · matching unlocked",
  "onboarding.reveal.budget": "Monthly budget",
  "onboarding.reveal.cta": "See my matches",
  "persona.neat": "Neat",
  "persona.relaxed": "Relaxed",
  "persona.balanced": "Balanced",
  "persona.social": "social",
  "persona.quiet": "homebody",
  "persona.nightowl": "night owl",
  "persona.earlybird": "early bird",
  "persona.flexible": "flexible spirit",

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
  "dashboard.subtitle": "Manage matches, bills, and more in one place.",
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

  /* ---------- Landing (redesign) ---------- */
  "land.nav.how": "How it works",
  "land.nav.features": "Features",
  "land.nav.automation": "Automation",
  "land.nav.hosts": "For hosts",
  "land.hero.badge": "Behavior-based rentals for Georgian students",
  "land.hero.title.a": "Stop scrolling Facebook groups.",
  "land.hero.title.b": "Start living with people who fit.",
  "land.hero.subtitle":
    "SakhliAI scores flatmates and homes on sleep schedule, cleanliness, budget and lifestyle — then an AI agent handles the boring parts: bills, rules, and the lease.",
  "land.hero.cta.student": "I'm a student",
  "land.hero.cta.host": "I list properties",
  "land.hero.demo.match": "match!",
  "land.hero.trust": "Students from",

  "land.problem.tag": "The old way is broken",
  "land.problem.title": "Finding a flat in Tbilisi shouldn't be a gamble",
  "land.before.title": "Without SakhliAI",
  "land.before.1": "Endless Facebook-group scrolling",
  "land.before.2": "Move in with a stranger, hope it works",
  "land.before.3": "Awkward fights over bills and chores",
  "land.before.4": "Lease in a language you half-understand",
  "land.after.title": "With SakhliAI",
  "land.after.1": "Fit-scored matches near your university",
  "land.after.2": "Know the lifestyle match before you connect",
  "land.after.3": "Bills split fairly, automatically",
  "land.after.4": "Clear bilingual lease, signed in-app",

  "land.match.tag": "Not vibes — signals",
  "land.match.title": "See exactly why two people fit",
  "land.match.subtitle":
    "Every match is broken down into the factors that actually cause flatmate conflict. No black box.",
  "land.match.factor.sleep": "Sleep schedule",
  "land.match.factor.clean": "Cleanliness",
  "land.match.factor.budget": "Budget overlap",
  "land.match.factor.lifestyle": "Lifestyle habits",
  "land.match.overall": "Overall fit",

  "land.features.tag": "Everything in one place",
  "land.features.title": "From first swipe to signed lease",
  "land.feat.discover.title": "Swipe to discover",
  "land.feat.discover.desc":
    "Browse fit-scored flatmates and homes like a feed. Like, match, and move in — no spam, no agents.",
  "land.feat.split.title": "Bills split fairly, by an agent",
  "land.feat.split.desc":
    "The AI pro-rates every bill by who moved in when, and tells you the reasoning in one line. No spreadsheets, no arguments.",
  "land.feat.mediator.title": "AI house-rules mediator",
  "land.feat.mediator.desc":
    "Disagree on noise, guests, or cleaning? Describe it and get a fair compromise drawn from both of your profiles.",
  "land.feat.lease.title": "Lease, signed in minutes",
  "land.feat.lease.desc":
    "A clear bilingual lease generated for your match, signed digitally and secured in the SakhliAI Vault.",

  "land.auto.tag": "The agent never sleeps",
  "land.auto.title": "An AI agent works behind every match",
  "land.auto.subtitle":
    "Matching, bill-splitting, applicant screening and turnover are run by an AI agent and n8n automations — live, while you get on with your studies.",
  "land.auto.live": "Live agent activity",

  "land.host.tag": "For hosts",
  "land.host.title": "Own property? Run it on autopilot.",
  "land.host.desc":
    "One live calendar across Airbnb, Booking.com and student leases. AI rent pricing, automated cleaning and smart-lock codes — synced in real time by n8n.",
  "land.host.cta": "Explore the host dashboard",

  "land.footer.tagline": "Behavior-based flatmate matching and automated rentals for Georgia.",
  "land.footer.product": "Product",
  "land.footer.company": "Company",
  "land.footer.students": "For students",
  "land.footer.hosts": "For hosts",
  "land.footer.lang": "English / ქართული",

  /* ---------- Auth / role select / assistant ---------- */
  "auth.title": "Sign in to continue",
  "auth.desc":
    "Authentication is required to view compatible flatmates and homes. You can return to the homepage as a guest.",
  "auth.back": "Back to homepage",
  "auth.signin": "Sign in",
  "auth.create": "Create account",
  "auth.name": "Full name",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.signin.go": "Sign in",
  "auth.encrypted": "Sessions are end-to-end encrypted. We never share your data with hosts.",

  "role.title": "Choose your role",
  "role.subtitle": "How will you use SakhliAI?",
  "role.student.title": "Rent a flat (Student)",
  "role.student.desc":
    "Take the compatibility quiz and swipe through fit-scored flatmates and homes near your university.",
  "role.host.title": "Rent out my place (Host)",
  "role.host.desc":
    "Unified live calendar, channel sync (Airbnb, Booking.com), AI rent predictor, and occupancy analytics.",
  "role.current": "Current role",
  "role.tap": "Tap to select",
  "role.change": "Change role",
  "role.account.title": "Create your account",
  "role.student.next": "Next — the 7-step student quiz.",
  "role.host.next": "Next — your host dashboard and calendar.",
  "role.setup": "Setting up your profile…",
  "role.saved": "Your role is saved and applied the moment your account is ready.",
  "role.signin.continue": "Sign in & continue",
  "role.create.continue": "Create account & continue",

  "assistant.name": "SakhliAI Assistant",
  "assistant.placeholder": "Ask SakhliAI…",
  "assistant.why": "· why we suggest this",

  /* ---------- Utility splitter ---------- */
  "util.linked": "Splitting bills for",
  "util.notlinked": "Pick a property on Matches to link the calculator to a specific flat.",
  "util.title": "AI Bill Splitter",
  "util.desc": "Track monthly utilities and split them fairly — by move-in date or equally.",
  "util.mode.movein": "By move-in dates",
  "util.mode.equal": "Equal split",
  "util.bills": "Monthly bills",
  "util.monthly": "monthly",
  "util.amount": "Amount",
  "util.add": "Add",
  "util.flatmates": "Flatmates",
  "util.day": "Day",
  "util.addFlatmate": "Add flatmate",
  "util.total": "Monthly total",
  "util.split.movein": "Split by move-in days",
  "util.split.equal": "Split equally",
  "util.pay": "Proceed to pay",
  "util.pay.tbc": "TBC Bank",
  "util.pay.bog": "Bank of Georgia",
  "util.paid": "Paid successfully",
  "util.via": "via",
  "util.who": "Who pays what",
  "util.reasoning": "SakhliAI split · reasoning per person",
  "util.calc": "Calculating fair split…",
  "util.days": "days",
  "util.yourShare": "Your share",
  "util.payRoommate": "Pay to roommate",
  "util.fairness": "AI fairness check:",
  "util.fairness.desc":
    "Totals reconcile exactly. Payments are mocked — connect a Georgian PSP (TBC Pay / BoG) for real transfers.",
  "util.rules.title": "AI house-rules mediator",
  "util.rules.desc":
    "Disagree with a flatmate? The AI reads both onboarding profiles and proposes a fair compromise.",
  "util.reason.equal": "Equal share across {n} flatmates",
  "util.reason.most": "Here from day {d} — full {days}/30 days, pays the most",
  "util.reason.less": "Moved in day {d} → only {days}/30 days, pays less",

  /* ---------- Checkout ---------- */
  "checkout.title": "Checkout",
  "checkout.back": "Back to settings",
  "checkout.plan": "Plan",
  "checkout.billed": "Billed monthly · cancel anytime",
  "checkout.method": "Payment method",
  "checkout.pay": "Pay",
  "checkout.processing": "Processing payment…",
  "checkout.success": "Payment successful",
  "checkout.activated": "is now active",
  "checkout.sim": "Simulated payment for the demo — no real charge is made.",
  "checkout.permonth": "/mo",

  /* ---------- Dashboard ---------- */
  "dashboard.addMatch": "Add New Match",
  "dashboard.addProperty": "Add New Property",
  "dashboard.removeProperty": "Remove Property",
  "dashboard.unmatch": "Unmatch",
  "dashboard.aiHouseRules": "AI House Rules",
  "dashboard.aiHouseRulesDesc": "Disagree with a flatmate? The AI reads both onboarding profiles and proposes a fair compromise.",

  /* ---------- Matches ---------- */
  "matches.aiBestFitDesc": "Show only matches ≥ 85%",
  "matches.upgrade": "Upgrade",
  "matches.freeLimit": "Free swipe limit reached",
  "matches.upgradeUnlimited": "Upgrade to keep swiping unlimited matches.",
  "matches.switchPlans": "Switch Plans",
  "matches.nextFreeSwipe": "Next free swipe in:",
  "matches.connections": "connections so far",

  /* ---------- Pricing ---------- */
  "pricing.toast.free": "Switched to Free",
  "pricing.toast.activated": "activated",
  "pricing.current": "Current",
  "pricing.switchToFree": "Switch to Free",
  "pricing.upgrade": "Upgrade",
  "pricing.orReturn": "or return to dashboard to keep browsing your existing matches",

  /* ---------- Settings ---------- */
  "settings.title": "User Settings",
  "settings.sendCode": "Send Code",
  "settings.chooseAvatar": "Choose Avatar",
  "settings.uploadPhoto": "Upload Custom Photo",
  "settings.subscription": "Subscription",
  "settings.upgrade": "Upgrade",
  "settings.manage": "Manage",
  "settings.verifiedSuccess": "Verified successfully",
  "settings.avatarSaved": "Avatar saved",
  "settings.photoUploaded": "Photo uploaded",
  "settings.selectImage": "Please select an image",
};

const ka: Dict = {
  "app.name": "SakhliAI",
  "app.tagline": "ჭკვიანი ქირაობა საქართველოში",
  "nav.home": "მთავარი",
  "nav.matches": "შესაბამისობები",
  "nav.dashboard": "დაფა",
  "nav.start": "დაიწყე",
  "nav.discover": "აღმოჩენა",
  "nav.saved": "მატჩები",
  "nav.utilities": "გადასახადები",
  "nav.profile": "პროფილი",
  "match.celebrate.title": "თქვენ ერთმანეთი მოიწონეთ!",
  "match.celebrate.desc": "ორივემ მოიწონეთ ერთმანეთი. მიესალმე და დაიწყე დაგეგმვა.",
  "match.celebrate.cta": "მისწერე შეტყობინება",
  "match.celebrate.keep": "გააგრძელე ცურვა",
  "matches.undo": "დაბრუნება",
  "host.nav.overview": "მიმოხილვა",
  "host.nav.calendar": "კალენდარი",
  "host.nav.channels": "არხები",
  "host.nav.applicants": "აპლიკანტები",
  "host.nav.operations": "ოპერაციები",
  "host.n8n.connected": "დაკავშირებულია n8n-თან",
  "host.n8n.lastsync": "ბოლო სინქი",

  "hero.title": "იპოვე თანამცხოვრები. იპოვე ბინა.",
  "hero.subtitle":
    "SakhliAI აკავშირებს სტუდენტებს საქართველოში თავსებად თანამცხოვრებთან და გრძელვადიან ბინებთან — ქცევის, ბიუჯეტისა და ცხოვრების სტილის მიხედვით.",
  "hero.cta.primary": "დაიწყე შერჩევა",
  "hero.cta.secondary": "როგორ მუშაობს",
  "hero.stat.students": "რეგისტრირებული სტუდენტი",
  "hero.stat.matches": "წარმატებული შერჩევა",
  "hero.stat.cities": "ქალაქი",

  "features.title": "შექმნილია ქართველი სტუდენტებისთვის",
  "features.match.title": "ქცევაზე დაფუძნებული შერჩევა",
  "features.match.desc": "ვამოწმებთ ძილის რეჟიმს, სისუფთავეს, სწავლის ჩვევებსა და ბიუჯეტს.",
  "features.swipe.title": "აღმოაჩინე გადაცურვით",
  "features.swipe.desc": "ნახე თავსებადი თანამცხოვრებლები და ბინები ფიდის სტილში. მოიწონე და გადადი.",
  "features.split.title": "გაიყავი კომუნალური მარტივად",
  "features.split.desc": "ჩაშენებული კალკულატორი სამართლიანად ანაწილებს გადასახადებს.",

  "how.title": "სამი ნაბიჯი ახალ სახლამდე",
  "how.s1.title": "გვითხარი შენ შესახებ",
  "how.s1.desc": "უნივერსიტეტი, ბიუჯეტი, ჩვევები — 2 წუთიანი ქვიზი.",
  "how.s2.title": "გადაცურე შენი შესაბამისობები",
  "how.s2.desc": "ნახე თავსებადი ადამიანები და ბინები.",
  "how.s3.title": "გადადი საცხოვრებლად",
  "how.s3.desc": "კომუნალური, ხელშეკრულება — ერთ აპში.",

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

  "onboarding.reveal.tag": "შენი საცხოვრებელი ტიპაჟი",
  "onboarding.reveal.ready": "პროფილი მზადაა · შერჩევა გააქტიურდა",
  "onboarding.reveal.budget": "თვიური ბიუჯეტი",
  "onboarding.reveal.cta": "ჩემი მატჩები",
  "persona.neat": "სუფთა",
  "persona.relaxed": "მოდუნებული",
  "persona.balanced": "დაბალანსებული",
  "persona.social": "სოციალური",
  "persona.quiet": "მშვიდი",
  "persona.nightowl": "ღამის ბუ",
  "persona.earlybird": "დილის ფრინველი",
  "persona.flexible": "მოქნილი",

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
  "dashboard.subtitle": "მართე შესაბამისობები, ანგარიშები და მეტი.",
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

  /* ---------- Landing (redesign) ---------- */
  "land.nav.how": "როგორ მუშაობს",
  "land.nav.features": "ფუნქციები",
  "land.nav.automation": "ავტომატიზაცია",
  "land.nav.hosts": "მასპინძლებს",
  "land.hero.badge": "ქცევაზე დაფუძნებული ქირაობა ქართველი სტუდენტებისთვის",
  "land.hero.title.a": "შეწყვიტე Facebook-ჯგუფების სქროლვა.",
  "land.hero.title.b": "იცხოვრე იმ ადამიანებთან, ვინც გერგება.",
  "land.hero.subtitle":
    "SakhliAI აფასებს თანამცხოვრებსა და ბინებს ძილის რეჟიმით, სისუფთავით, ბიუჯეტითა და ცხოვრების სტილით — შემდეგ კი AI აგენტი იღებს მოსაწყენ საქმეებს: გადასახადებს, წესებსა და ხელშეკრულებას.",
  "land.hero.cta.student": "მე სტუდენტი ვარ",
  "land.hero.cta.host": "მე ბინებს ვაქირავებ",
  "land.hero.demo.match": "თანხვედრა!",
  "land.hero.trust": "სტუდენტები",

  "land.problem.tag": "ძველი გზა გაფუჭებულია",
  "land.problem.title": "თბილისში ბინის პოვნა აზარტული თამაში არ უნდა იყოს",
  "land.before.title": "SakhliAI-ის გარეშე",
  "land.before.1": "გაუთავებელი Facebook-ჯგუფების სქროლვა",
  "land.before.2": "უცნობთან გადასვლა და იმედის დადება",
  "land.before.3": "უხერხული ჩხუბი გადასახადებსა და საქმეებზე",
  "land.before.4": "ხელშეკრულება ენაზე, რომელსაც ბოლომდე ვერ იგებ",
  "land.after.title": "SakhliAI-თან ერთად",
  "land.after.1": "შეფასებული მატჩები შენი უნივერსიტეტის ახლოს",
  "land.after.2": "გაიგე თავსებადობა დაკავშირებამდე",
  "land.after.3": "გადასახადები სამართლიანად, ავტომატურად იყოფა",
  "land.after.4": "გასაგები ორენოვანი ხელშეკრულება, ხელმოწერილი აპში",

  "land.match.tag": "არა ვაიბი — სიგნალები",
  "land.match.title": "ნახე ზუსტად, რატომ ერგებათ ორი ადამიანი ერთმანეთს",
  "land.match.subtitle":
    "ყველა მატჩი იშლება იმ ფაქტორებად, რომლებიც რეალურად იწვევს კონფლიქტს თანამცხოვრებებში. შავი ყუთის გარეშე.",
  "land.match.factor.sleep": "ძილის რეჟიმი",
  "land.match.factor.clean": "სისუფთავე",
  "land.match.factor.budget": "ბიუჯეტის თანხვედრა",
  "land.match.factor.lifestyle": "ცხოვრების ჩვევები",
  "land.match.overall": "საერთო თავსებადობა",

  "land.features.tag": "ყველაფერი ერთ ადგილას",
  "land.features.title": "პირველი გადაცურვიდან ხელმოწერილ ხელშეკრულებამდე",
  "land.feat.discover.title": "აღმოაჩინე გადაცურვით",
  "land.feat.discover.desc":
    "ნახე შეფასებული თანამცხოვრებლები და ბინები ფიდის სტილში. მოიწონე, დააკავშირე და გადადი საცხოვრებლად — სპამისა და აგენტების გარეშე.",
  "land.feat.split.title": "გადასახადებს აგენტი ანაწილებს",
  "land.feat.split.desc":
    "AI ანაწილებს ყველა გადასახადს იმის მიხედვით, ვინ როდის შემოვიდა, და ერთ წინადადებაში გიხსნის მიზეზს. ცხრილებისა და კამათის გარეშე.",
  "land.feat.mediator.title": "AI მედიატორი სახლის წესებზე",
  "land.feat.mediator.desc":
    "ვერ თანხმდებით ხმაურზე, სტუმრებზე ან დასუფთავებაზე? აღწერე და მიიღე სამართლიანი კომპრომისი თქვენი ორივე პროფილის მიხედვით.",
  "land.feat.lease.title": "ხელშეკრულება, ხელმოწერილი წუთებში",
  "land.feat.lease.desc":
    "გასაგები ორენოვანი ხელშეკრულება შენი მატჩისთვის, ხელმოწერილი ციფრულად და დაცული SakhliAI Vault-ში.",

  "land.auto.tag": "აგენტი არ იძინებს",
  "land.auto.title": "ყველა მატჩის უკან AI აგენტი დგას",
  "land.auto.subtitle":
    "შერჩევას, გადასახადების გაყოფას, აპლიკანტების შემოწმებასა და დასუფთავებას AI აგენტი და n8n ავტომატიზაციები მართავენ — ცოცხლად, სანამ შენ სწავლაზე ხარ ფოკუსირებული.",
  "land.auto.live": "აგენტის ცოცხალი აქტივობა",

  "land.host.tag": "მასპინძლებს",
  "land.host.title": "გაქვს ბინა? მართე ის ავტოპილოტზე.",
  "land.host.desc":
    "ერთი ცოცხალი კალენდარი Airbnb-ზე, Booking.com-სა და სტუდენტურ ხელშეკრულებებზე. AI ფასწარმოქმნა, ავტომატური დასუფთავება და ჭკვიანი საკეტის კოდები — რეალურ დროში n8n-ით სინქრონიზებული.",
  "land.host.cta": "ნახე მასპინძლის დაფა",

  "land.footer.tagline": "ქცევაზე დაფუძნებული თანამცხოვრებლების შერჩევა და ავტომატური ქირაობა საქართველოსთვის.",
  "land.footer.product": "პროდუქტი",
  "land.footer.company": "კომპანია",
  "land.footer.students": "სტუდენტებს",
  "land.footer.hosts": "მასპინძლებს",
  "land.footer.lang": "English / ქართული",

  /* ---------- Auth / role select / assistant ---------- */
  "auth.title": "ავტორიზაცია",
  "auth.desc":
    "თავსებადი თანამცხოვრებლებისა და ბინების სანახავად საჭიროა ავტორიზაცია. შეგიძლიათ დაბრუნდეთ მთავარ გვერდზე სტუმრის სტატუსით.",
  "auth.back": "უკან მთავარ გვერდზე",
  "auth.signin": "შესვლა",
  "auth.create": "ანგარიშის შექმნა",
  "auth.name": "სრული სახელი",
  "auth.email": "ელ-ფოსტა",
  "auth.password": "პაროლი",
  "auth.signin.go": "შესვლა",
  "auth.encrypted": "სესიები დაშიფრულია. თქვენს მონაცემებს მასპინძლებს არ ვუზიარებთ.",

  "role.title": "აირჩიეთ თქვენი როლი",
  "role.subtitle": "როგორ გამოიყენებთ SakhliAI-ს?",
  "role.student.title": "ბინის ქირაობა (სტუდენტი)",
  "role.student.desc":
    "გაიარეთ თავსებადობის ქვიზი და დაათვალიერეთ შეფასებული თანამცხოვრებლები და ბინები უნივერსიტეტთან ახლოს.",
  "role.host.title": "ბინის გაქირავება (მასპინძელი)",
  "role.host.desc":
    "ერთიანი ცოცხალი კალენდარი, არხების სინქი (Airbnb, Booking.com), AI ქირის პროგნოზი და დატვირთულობის ანალიტიკა.",
  "role.current": "მიმდინარე როლი",
  "role.tap": "აირჩიეთ",
  "role.change": "როლის შეცვლა",
  "role.account.title": "შექმენით თქვენი ანგარიში",
  "role.student.next": "შემდეგ — 7-ნაბიჯიანი სტუდენტური ქვიზი.",
  "role.host.next": "შემდეგ — მასპინძლის დაფა და კალენდარი.",
  "role.setup": "მიმდინარეობს თქვენი პროფილის მომზადება…",
  "role.saved": "თქვენი როლი შენახულია და გააქტიურდება ანგარიშის მზადყოფნისთანავე.",
  "role.signin.continue": "შესვლა და გაგრძელება",
  "role.create.continue": "ანგარიშის შექმნა და გაგრძელება",

  "assistant.name": "SakhliAI ასისტენტი",
  "assistant.placeholder": "ჰკითხე SakhliAI-ს…",
  "assistant.why": "· რატომ გირჩევთ",

  /* ---------- Utility splitter ---------- */
  "util.linked": "ანგარიშები ბინისთვის",
  "util.notlinked": "აირჩიეთ ბინა Matches გვერდზე, რომ კალკულატორი დაუკავშირდეს კონკრეტულ ბინას.",
  "util.title": "AI კომუნალურების გამყოფი",
  "util.desc": "თვალი ადევნეთ თვიურ გადასახადებს და გაყავით სამართლიანად — შესვლის თარიღით ან თანაბრად.",
  "util.mode.movein": "შესვლის თარიღით",
  "util.mode.equal": "თანაბარი გაყოფა",
  "util.bills": "თვიური გადასახადები",
  "util.monthly": "თვიური",
  "util.amount": "თანხა",
  "util.add": "დამატება",
  "util.flatmates": "თანამცხოვრებლები",
  "util.day": "დღე",
  "util.addFlatmate": "თანამცხოვრების დამატება",
  "util.total": "თვიური ჯამი",
  "util.split.movein": "გაყოფილია შესვლის დღეებით",
  "util.split.equal": "თანაბრად გაყოფილი",
  "util.pay": "გადახდა",
  "util.paid": "გადახდილია წარმატებით",
  "util.via": "მეშვეობით",
  "util.who": "ვინ რამდენს იხდის",
  "util.reasoning": "SakhliAI გაყოფა · დასაბუთება თითო პირზე",
  "util.calc": "მიმდინარეობს სამართლიანი გაყოფის დათვლა…",
  "util.days": "დღე",
  "util.yourShare": "შენი წილი",
  "util.payRoommate": "გადახდა თანამცხოვრებზე",
  "util.fairness": "AI სამართლიანობის შემოწმება:",
  "util.fairness.desc":
    "ჯამები ზუსტად ემთხვევა. გადახდები სიმულირებულია — დააკავშირეთ ქართული PSP (TBC Pay / BoG) რეალური გადარიცხვებისთვის.",
  "util.rules.title": "AI მედიატორი სახლის წესებზე",
  "util.rules.desc":
    "ვერ ეთანხმები თანამცხოვრებს? AI კითხულობს ორივეს ონბორდინგის პროფილს და სთავაზობს სამართლიან კომპრომისს.",
  "util.reason.equal": "თანაბარი წილი {n} თანამცხოვრებზე",
  "util.reason.most": "დღე {d}-დან — სრული {days}/30 დღე, ყველაზე მეტს იხდის",
  "util.reason.less": "შემოვიდა დღე {d}-ში → მხოლოდ {days}/30 დღე, ნაკლებს იხდის",

  /* ---------- Checkout ---------- */
  "checkout.title": "გადახდა",
  "checkout.back": "უკან პარამეტრებში",
  "checkout.plan": "ტარიფი",
  "checkout.billed": "ყოველთვიური გადახდა · გააუქმე ნებისმიერ დროს",
  "checkout.method": "გადახდის მეთოდი",
  "checkout.pay": "გადახდა",
  "checkout.processing": "მიმდინარეობს გადახდა…",
  "checkout.success": "გადახდა წარმატებულია",
  "checkout.activated": "გააქტიურდა",
  "checkout.sim": "სიმულირებული გადახდა დემოსთვის — რეალური ჩამოჭრის გარეშე.",
  "checkout.permonth": "/თვე",

  /* ---------- Dashboard ---------- */
  "dashboard.addMatch": "ახალი თანამცხოვრებლის დამატება",
  "dashboard.addProperty": "ახალი ბინის დამატება",
  "dashboard.removeProperty": "ბინის წაშლა",
  "dashboard.unmatch": "კავშირის გაწყვეტა",
  "dashboard.aiHouseRules": "AI კონფლიქტების მედიატორი",
  "dashboard.aiHouseRulesDesc": "არ ეთანხმები flatmate-ს? AI გააანალიზებს onboarding-ის ჩვევებს და გასცემს კომპრომისს.",

  /* ---------- Matches ---------- */
  "matches.aiBestFitDesc": "მხოლოდ ≥85%-ის ჩვენება",
  "matches.upgrade": "განაახლეთ ტარიფი",
  "matches.freeLimit": "მიაღწიე უფასო ლიმიტს",
  "matches.upgradeUnlimited": "განაახლეთ ტარიფი შეუზღუდავი მატჩებისთვის.",
  "matches.switchPlans": "განაახლეთ ტარიფი",
  "matches.nextFreeSwipe": "შემდეგი უფასო სვაიპი:",
  "matches.connections": "კავშირი ამ დრომდე",

  /* ---------- Pricing ---------- */
  "pricing.toast.free": "გადახვედი Free ტარიფზე",
  "pricing.toast.activated": "გააქტიურდა",
  "pricing.current": "მიმდინარე",
  "pricing.switchToFree": "Free-ზე გადასვლა",
  "pricing.upgrade": "განაახლეთ ტარიფი",
  "pricing.orReturn": "ან დაბრუნდი დაფაზე რომ განაგრძო არსებული მატჩების დათვალიერება",

  /* ---------- Settings ---------- */
  "settings.title": "მომხმარებლის პარამეტრები",
  "settings.sendCode": "კოდის გაგზავნა",
  "settings.chooseAvatar": "ავატარის არჩევა",
  "settings.uploadPhoto": "ფოტოს ატვირთვა",
  "settings.subscription": "ტარიფი",
  "settings.upgrade": "განაახლეთ",
  "settings.manage": "მართვა",
  "settings.verifiedSuccess": "ვერიფიკაცია წარმატებით დასრულდა",
  "settings.avatarSaved": "ავატარი შენახულია",
  "settings.photoUploaded": "ფოტო ატვირთულია",
  "settings.selectImage": "გთხოვთ აირჩიოთ სურათი",
};

const dicts: Record<Locale, Dict> = { en, ka };

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
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

  const t = (key: string, vars?: Record<string, string | number>) => {
    let s = dicts[locale][key] ?? dicts.en[key] ?? key;
    if (vars) for (const k of Object.keys(vars)) s = s.replace(`{${k}}`, String(vars[k]));
    return s;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
