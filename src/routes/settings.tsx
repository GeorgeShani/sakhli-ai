import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AuthGate } from "@/components/AuthGate";
import { Button } from "@/components/ui/button";
import { PricingModal } from "@/components/PricingModal";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { useProfile, defaultProfile } from "@/lib/student-store";
import { useSubscription, PLAN_DETAILS } from "@/lib/subscription";
import {
  Check,
  Crown,
  ImageIcon,
  Loader2,
  LogOut,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  Upload,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SakhliAI" },
      { name: "description", content: "Manage your account, verification, and preferences." },
    ],
  }),
  component: () => (
    <AuthGate>
      <SettingsPage />
    </AuthGate>
  ),
});

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Nova&backgroundColor=b6e3f4",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Pixel&backgroundColor=c0aede",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Quark&backgroundColor=ffd5dc",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Hex&backgroundColor=d1f4d1",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Echo&backgroundColor=fde6a8",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Lumen&backgroundColor=fcd5ce",
];

function SettingsPage() {
  const { user, profile: authProfile, signOut } = useAuth();
  const { profile, save } = useProfile();
  const { theme, toggle } = useTheme();
  const { plan } = useSubscription();
  const navigate = useNavigate();

  const [sendingCode, setSendingCode] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);

  const activeProfile = profile ?? defaultProfile;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const handleSendCode = () => {
    if (sendingCode) return;
    setSendingCode(true);
    window.setTimeout(() => {
      save({ ...activeProfile, verified: true });
      setSendingCode(false);
      toast.success("ვერიფიკაცია წარმატებით დასრულდა · Verified successfully");
    }, 1200);
  };

  const handlePickAvatar = (url: string) => {
    save({ ...activeProfile, avatar: url });
    setShowAvatars(false);
    toast.success("ავატარი შენახულია · Avatar saved");
  };

  const planDetails = PLAN_DETAILS[plan];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-bold">მომხმარებლის პარამეტრები</h1>
        <p className="mt-1 text-sm text-muted-foreground">User Settings</p>

        <div className="card-elevated mt-6 p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              {activeProfile.avatar ? (
                <img
                  src={activeProfile.avatar}
                  alt="avatar"
                  className="h-16 w-16 rounded-full border-2 border-primary/30 bg-secondary object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <UserIcon className="h-7 w-7" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-display text-lg font-semibold">
                {activeProfile.name || authProfile?.full_name || "Student"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                <span className="truncate">{user?.email}</span>
                {activeProfile.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.55)] dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                ) : (
                  <Button size="sm" className="ml-1 h-7 px-2 text-[11px]" onClick={handleSendCode} disabled={sendingCode}>
                    {sendingCode ? (
                      <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    ) : (
                      <Mail className="mr-1 h-3 w-3" />
                    )}
                    კოდის გაგზავნა / Send Code
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setShowAvatars((v) => !v)}
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            ავატარის არჩევა / Choose Avatar
          </Button>

          {showAvatars && (
            <div className="mt-3 grid grid-cols-6 gap-2 rounded-lg border border-border bg-secondary/40 p-3">
              {AVATAR_OPTIONS.map((url) => {
                const selected = activeProfile.avatar === url;
                return (
                  <button
                    key={url}
                    type="button"
                    onClick={() => handlePickAvatar(url)}
                    className={[
                      "relative aspect-square overflow-hidden rounded-full border-2 transition-all hover:scale-105",
                      selected ? "border-primary shadow-[0_0_14px_var(--primary)]" : "border-border",
                    ].join(" ")}
                  >
                    <img src={url} alt="avatar option" className="h-full w-full object-cover" />
                    {selected && (
                      <span className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-elevated mt-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                ტარიფი / Subscription
              </div>
              <div className="mt-1 font-display text-lg font-semibold">
                {planDetails.name}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  · {planDetails.price} GEL/mo
                </span>
              </div>
              <div className="text-xs text-muted-foreground">{planDetails.tag}</div>
            </div>
            <Button onClick={() => setPricingOpen(true)}>
              <Crown className="mr-2 h-4 w-4" />
              {plan === "free" ? "განაახლეთ / Upgrade" : "მართვა / Manage"}
            </Button>
          </div>
        </div>

        <div className="card-elevated mt-4 p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Appearance</div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="font-medium">Light / Dark mode</div>
              <div className="text-xs text-muted-foreground">
                Current: {theme === "dark" ? "Dark" : theme === "system" ? "System" : "Light"}
              </div>
            </div>
            <Button variant="outline" onClick={toggle}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              Toggle theme
            </Button>
          </div>
        </div>

        <div className="card-elevated mt-4 p-5">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            Student verification
          </div>
          <div className="mt-2 text-sm">
            {activeProfile.verified
              ? "Your academic email has been confirmed. You can access all matching features."
              : "Send a verification code to confirm your academic email and unlock the verified badge."}
          </div>
          {activeProfile.university && (
            <div className="mt-2 text-sm text-muted-foreground">
              University: <span className="text-foreground">{activeProfile.university}</span>
            </div>
          )}
        </div>

        <Button variant="destructive" className="mt-6 w-full" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Button>
      </div>

      <PricingModal open={pricingOpen} onOpenChange={setPricingOpen} reason="manual" />
    </div>
  );
}
